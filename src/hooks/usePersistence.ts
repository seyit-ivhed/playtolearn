import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game/store';
import { PersistenceService } from '../services/persistence.service';
import { useAuth } from './useAuth';

export const usePersistence = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const isInitialLoad = useRef(true);

    // 1. Handle Initial Rehydration from Supabase
    useEffect(() => {
        if (!loading && isAuthenticated && user && isInitialLoad.current) {
            isInitialLoad.current = false;

            PersistenceService.pullState(user.id).then((cloudState) => {
                if (cloudState) {
                    console.log('Rehydrating game state from Supabase...');
                    // Merge cloud state into local store
                    // Server wins for now as per architecture
                    useGameStore.setState(cloudState);
                }
            });
        }
    }, [isAuthenticated, user, loading]);
};
