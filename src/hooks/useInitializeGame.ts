import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { useGameStore } from '../stores/game/store';
import { usePremiumStore } from '../stores/premium.store';
import { PersistenceService } from '../services/persistence.service';
import { supabase } from '../services/supabase.service';

export const useInitializeGame = () => {
    const { isAuthenticated, user, loading: authLoading, refreshSession } = useAuth();
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shouldNavigateToMap, setShouldNavigateToMap] = useState(false);

    const initializePremium = usePremiumStore(state => state.initialize);
    const initialized = useRef(false);

    const performInitialization = useCallback(async () => {
        if (authLoading) return;
        if (initialized.current) return;

        console.log('Starting game initialization sequence...');
        setError(null);
        setIsInitializing(true);

        try {
            if (isAuthenticated && user) {
                console.log('User is authenticated, pulling state from backend...');

                // 1. Pull State from Backend
                const cloudState = await PersistenceService.pullState(user.id);

                if (cloudState) {
                    console.log('Cloud state found, rehydrating store...');
                    useGameStore.setState(cloudState);

                    // Check if we should navigate to map
                    const state = useGameStore.getState();
                    if (state.activeAdventureId && (Object.keys(state.encounterResults).length > 0 || state.currentMapNode > 1)) {
                        setShouldNavigateToMap(true);
                    }
                } else {
                    console.log('No cloud state found. Syncing local progress to cloud...');
                    await PersistenceService.pushState(user.id, useGameStore.getState());
                }

                // 2. Initialize Premium Store
                await initializePremium(true);
            } else {
                console.log('User is not authenticated (guest mode). Checking connectivity...');
                // Force a connectivity check: try to fetch something small or refresh session
                // supabase.auth.getSession() usually hits cache, but refreshSession hits server.
                // Or we can just check if we can reach any public table.
                const { error: pingError } = await supabase.from('player_profiles').select('count').limit(0);
                if (pingError) throw pingError;

                // If it's a guest, we check if they have local progress that warrants going to map
                const state = useGameStore.getState();
                if (state.activeAdventureId && (Object.keys(state.encounterResults).length > 0 || state.currentMapNode > 1)) {
                    setShouldNavigateToMap(true);
                }
            }

            initialized.current = true;
            setIsInitializing(false);
        } catch (err) {
            console.error('Initialization failed:', err);
            setError('offline');
            setIsInitializing(false);
            setShouldNavigateToMap(false);
        }
    }, [authLoading, isAuthenticated, user, initializePremium]);

    useEffect(() => {
        performInitialization();
    }, [performInitialization]);

    const retry = useCallback(() => {
        initialized.current = false;
        // We might need to refresh session if it's an auth-related failure
        refreshSession().then(() => {
            performInitialization();
        });
    }, [performInitialization, refreshSession]);

    return {
        isInitializing: isInitializing || authLoading,
        error,
        shouldNavigateToMap,
        retry
    };
};
