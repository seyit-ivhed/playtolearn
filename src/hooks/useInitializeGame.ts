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
    const lastAuthId = useRef<string | undefined>(user?.id);

    // Re-initialize if auth identity changes (e.g. guest -> anonymous)
    if (user?.id !== lastAuthId.current) {
        initialized.current = false;
        lastAuthId.current = user?.id;
    }

    const performInitialization = useCallback(async () => {
        if (authLoading) return;
        if (initialized.current) return;

        console.log('Starting game initialization sequence...');
        initialized.current = true; // Set immediately to prevent race conditions
        setError(null);
        setIsInitializing(true);

        try {
            if (isAuthenticated && user) {
                console.log('User is authenticated, initializing data...');

                // 1. Get or create profile (single fetch)
                const profile = await PersistenceService.getOrCreateProfile(user.id);

                // 2. Fetch state and entitlements in parallel
                const [cloudState] = await Promise.all([
                    PersistenceService.pullState(user.id, profile.id),
                    initializePremium(false, profile) // Not forced, using shared profile
                ]);

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
                    await PersistenceService.pushState(user.id, useGameStore.getState(), profile.id);
                }
            } else {
                console.log('User is not authenticated (guest mode). Checking connectivity...');
                const { error: pingError } = await supabase.from('player_profiles').select('count').limit(0);
                if (pingError) throw pingError;

                // Sync guest state if any
                const state = useGameStore.getState();
                if (state.activeAdventureId && (Object.keys(state.encounterResults).length > 0 || state.currentMapNode > 1)) {
                    setShouldNavigateToMap(true);
                }
            }

            setIsInitializing(false);
        } catch (err) {
            console.error('Initialization failed:', err);
            initialized.current = false; // Reset on failure to allow retry
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
