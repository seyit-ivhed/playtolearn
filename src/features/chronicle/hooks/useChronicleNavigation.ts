import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePremiumStore } from '../../../stores/premium.store';
import type { Adventure } from '../../../types/adventure.types';

interface UseChronicleNavigationProps {
    currentAdventureIndex: number;
    volumeAdventures: Adventure[];
    currentAdventure: Adventure | undefined;
    setActiveAdventureId: (id: string) => void;
    setIsPremiumModalOpen: (open: boolean) => void;
    setIsTocOpen: (open: boolean) => void;
}

export const useChronicleNavigation = ({
    currentAdventureIndex,
    volumeAdventures,
    currentAdventure,
    setActiveAdventureId,
    setIsPremiumModalOpen,
    setIsTocOpen
}: UseChronicleNavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdventureUnlocked } = usePremiumStore();

    const justCompletedAdventureId = location.state?.justCompletedAdventureId;
    const isJustCompleted = currentAdventure && justCompletedAdventureId === currentAdventure.id;

    const handleNext = useCallback(() => {
        if (currentAdventureIndex < volumeAdventures.length - 1) {
            const nextAdj = volumeAdventures[currentAdventureIndex + 1];
            setActiveAdventureId(nextAdj.id);

            if (isJustCompleted) {
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [currentAdventureIndex, volumeAdventures, setActiveAdventureId, isJustCompleted, navigate, location.pathname]);

    const handlePrev = useCallback(() => {
        if (currentAdventureIndex > 0) {
            const prevAdj = volumeAdventures[currentAdventureIndex - 1];
            setActiveAdventureId(prevAdj.id);
        }
    }, [currentAdventureIndex, volumeAdventures, setActiveAdventureId]);

    const handleJumpToChapter = useCallback((_volumeId: string, adventureId: string) => {
        setActiveAdventureId(adventureId);
        setIsTocOpen(false);
    }, [setActiveAdventureId, setIsTocOpen]);

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
        handleJumpToChapter,
        handleBegin,
        isJustCompleted
    };
};
