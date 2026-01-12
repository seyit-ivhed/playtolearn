import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useGameStore, selectCompletedEncountersCount } from '../stores/game/store';

export const useAnonymousLoginTrigger = () => {
    const { isAuthenticated, signInAnonymously, loading: authLoading } = useAuth();
    const completedEncountersCount = useGameStore(selectCompletedEncountersCount);
    const authTriggered = useRef(false);

    useEffect(() => {
        const milestoneReached = completedEncountersCount >= 3;
        
        if (!authLoading && milestoneReached && !isAuthenticated && !authTriggered.current) {
            console.log('Milestone reached! Creating anonymous account...');
            authTriggered.current = true;
            signInAnonymously().catch(err => {
                console.error('Failed to create anonymous account:', err);
                authTriggered.current = false; // Allow retry on failure
            });
        }
    }, [completedEncountersCount, isAuthenticated, signInAnonymously, authLoading]);
};
