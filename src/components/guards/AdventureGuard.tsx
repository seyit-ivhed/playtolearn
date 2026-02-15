import React, { useCallback } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useGameStore } from '../../stores/game/store';
import { usePremiumStore } from '../../stores/premium.store';
import { checkNavigationAccess } from '../../utils/navigation-security.utils';
import { LoadingScreen } from '../LoadingScreen';

interface AdventureGuardProps {
    children: React.ReactNode;
}

export const AdventureGuard = ({ children }: AdventureGuardProps) => {
    const { adventureId, nodeIndex: nodeIndexParam } = useParams<{ adventureId: string; nodeIndex?: string }>();
    const nodeIndex = nodeIndexParam ? parseInt(nodeIndexParam, 10) : undefined;

    const { encounterResults, isAdventureUnlocked: isProgressionUnlocked } = useGameStore();
    const {
        isAdventureUnlocked: isPremiumUnlocked,
        initialized: premiumInitialized
    } = usePremiumStore();

    const isFreeAdventure = adventureId === '1';
    const shouldWait = !premiumInitialized && !isFreeAdventure;

    const safeIsPremiumUnlocked = useCallback((id: string) => {
        if (id === '1') {
            return true;
        }
        return isPremiumUnlocked(id);
    }, [isPremiumUnlocked]);

    if (shouldWait) {
        return <LoadingScreen />;
    }

    if (!adventureId) {
        return <Navigate to="/chronicle" replace />;
    }

    const access = checkNavigationAccess({
        adventureId,
        nodeIndex,
        isPremiumUnlocked: safeIsPremiumUnlocked,
        isProgressionUnlocked,
        encounterResults
    });

    if (!access.allowed) {
        console.warn(`[AdventureGuard] Access denied to adventure ${adventureId}. Reason: ${access.reason}`);
        return <Navigate to="/chronicle" replace />;
    }

    return <>{children}</>;
};
