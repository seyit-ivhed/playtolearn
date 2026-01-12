import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { useGameStore } from '../stores/game/store';
import { usePremiumStore } from '../stores/premium.store';
import { PersistenceService } from '../services/persistence.service';


/**
 * Orchestrates the initial loading sequence:
 * 1. Checks authentication status
 * 2. Fetches player profile and rehydrates game state from cloud
 * 3. Initializes premium entitlements
 * 4. Resolves the landing page (Chronicle)
 */
export const useInitializeGame = () => {
    const { isAuthenticated, user, loading: authLoading, refreshSession } = useAuth();
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const initializePremium = usePremiumStore(state => state.initialize);
    const initialized = useRef(false);
    const lastAuthId = useRef<string | undefined>(user?.id);

    const performInitialization = useCallback(async () => {
        await Promise.resolve();
        if (authLoading) return;

        // Re-initialize if auth identity changes or not initialized yet
        if (initialized.current && lastAuthId.current === user?.id) {
            return;
        }

        console.log('Starting game initialization sequence...');
        initialized.current = true; // Set immediately to prevent race conditions
        lastAuthId.current = user?.id;
        setError(null);
        setIsInitializing(true);

        try {
            if (isAuthenticated && user) {
                console.log('User is authenticated, initializing data...');

                // 1. Get or create profile (single fetch)
                const profile = await PersistenceService.getOrCreateProfile(user.id);

                // 2. Fetch state and entitlements in parallel
                const [cloudState] = await Promise.all([
                    PersistenceService.pullState(user.id),
                    initializePremium(false, profile) // Not forced, using shared profile
                ]);

                if (cloudState) {
                    console.log('Cloud state found, rehydrating store...');
                    useGameStore.setState(cloudState);

                    // New players (no progress) land on prologue, others land on highest unlocked
                    // Note: Resolution is now handled algorithmically in useChronicleData
                } else {
                    console.log('No cloud state found. Syncing local progress to cloud...');
                    await PersistenceService.pushState(user.id, useGameStore.getState());
                }
            } else {
                console.log('User is not authenticated (guest mode). Checking connectivity...');
                // Ensure premium is initialized even for guests (to know what's locked)
                await initializePremium(false);
            }

            setIsInitializing(false);
        } catch (err: unknown) {
            console.error('Initialization failed:', err);
            initialized.current = false; // Reset on failure to allow retry
            setError('offline');
            setIsInitializing(false);
        }
    }, [authLoading, isAuthenticated, user, initializePremium]);

    useEffect(() => {
        const runInit = async () => {
            await performInitialization();
        };
        runInit();
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
        retry
    };
};
