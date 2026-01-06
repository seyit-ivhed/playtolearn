import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../../../stores/game/store';
import { usePremiumStore } from '../../../stores/premium.store';
import type { Adventure, Volume } from '../../../types/adventure.types';

interface UseChronicleNavigationProps {
    currentAdventureIndex: number;
    volumeAdventures: Adventure[];
    currentVolume: Volume;
    currentAdventure: Adventure | undefined;
    setIsPremiumModalOpen: (open: boolean) => void;
    setIsTocOpen: (open: boolean) => void;
}

export const useChronicleNavigation = ({
    currentAdventureIndex,
    volumeAdventures,
    currentVolume,
    currentAdventure,
    setIsPremiumModalOpen,
    setIsTocOpen
}: UseChronicleNavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateChroniclePosition } = useGameStore();
    const { isAdventureUnlocked } = usePremiumStore();

    const justCompletedAdventureId = location.state?.justCompletedAdventureId;
    const isJustCompleted = currentAdventure && justCompletedAdventureId === currentAdventure.id;

    const handleNext = useCallback(() => {
        if (currentAdventureIndex < volumeAdventures.length - 1) {
            const nextAdj = volumeAdventures[currentAdventureIndex + 1];
            updateChroniclePosition(currentVolume.id, nextAdj.id);

            if (isJustCompleted) {
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [currentAdventureIndex, volumeAdventures, currentVolume.id, updateChroniclePosition, isJustCompleted, navigate, location.pathname]);

    const handlePrev = useCallback(() => {
        if (currentAdventureIndex > 0) {
            const prevAdj = volumeAdventures[currentAdventureIndex - 1];
            updateChroniclePosition(currentVolume.id, prevAdj.id);
        }
    }, [currentAdventureIndex, volumeAdventures, currentVolume.id, updateChroniclePosition]);

    const handleJumpToChapter = useCallback((volumeId: string, adventureId: string) => {
        updateChroniclePosition(volumeId, adventureId);
        setIsTocOpen(false);
    }, [updateChroniclePosition, setIsTocOpen]);

    const handleBegin = useCallback((id: string) => {
        if (id === 'prologue') return;

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
