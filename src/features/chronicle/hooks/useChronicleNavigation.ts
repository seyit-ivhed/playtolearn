import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePremiumStore } from '../../../stores/premium.store';
import type { Adventure } from '../../../types/adventure.types';

interface UseChronicleNavigationProps {
    currentAdventureIndex: number;
    adventures: Adventure[];
    currentAdventure: Adventure | undefined;
    setActiveAdventureId: (id: string) => void;
    setIsPremiumModalOpen: (open: boolean) => void;
}

export const useChronicleNavigation = ({
    currentAdventureIndex,
    adventures,
    currentAdventure,
    setActiveAdventureId,
    setIsPremiumModalOpen
}: UseChronicleNavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdventureUnlocked } = usePremiumStore();

    const justCompletedAdventureId = location.state?.justCompletedAdventureId;
    const isJustCompleted = currentAdventure && justCompletedAdventureId === currentAdventure.id;

    const handleNext = useCallback(() => {
        if (currentAdventureIndex < adventures.length - 1) {
            const nextAdj = adventures[currentAdventureIndex + 1];
            setActiveAdventureId(nextAdj.id);

            if (isJustCompleted) {
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [currentAdventureIndex, adventures, setActiveAdventureId, isJustCompleted, navigate, location.pathname]);

    const handlePrev = useCallback(() => {
        if (currentAdventureIndex > 0) {
            const prevAdj = adventures[currentAdventureIndex - 1];
            setActiveAdventureId(prevAdj.id);
        }
    }, [currentAdventureIndex, adventures, setActiveAdventureId]);

    const handleBegin = useCallback((id: string) => {
        if (!isAdventureUnlocked(id)) {
            setIsPremiumModalOpen(true);
            return;
        }

        // Navigate to the map for this adventure
        navigate(`/map/${id}`);
    }, [isAdventureUnlocked, navigate, setIsPremiumModalOpen]);

    return {
        handleNext,
        handlePrev,
        handleBegin,
        isJustCompleted
    };
};
