import { useMemo, useState } from 'react';
import { ADVENTURES } from '../../../data/adventures.data';
import { useGameStore } from '../../../stores/game/store';
import { getHighestUnlockedAdventure } from '../../adventure/utils/navigation.utils';
import { resolveCurrentAdventureIndex } from '../utils/chronicle.utils';

export const useChronicleData = (overrideAdventureId?: string) => {
    const { encounterResults, adventureStatuses } = useGameStore();

    // For new players (no progress), default to first adventure
    // For returning players, show their highest unlocked adventure
    const initialAdventure = useMemo(() => {
        if (overrideAdventureId) {
            return overrideAdventureId;
        }

        const hasProgress = Object.keys(encounterResults).length > 0;
        if (hasProgress) {
            const highestUnlocked = getHighestUnlockedAdventure(adventureStatuses);
            if (!highestUnlocked) {
                console.error('Could not determine highest unlocked adventure');
                return '';
            }
            return highestUnlocked.adventureId;
        }

        const firstAdventure = ADVENTURES[0];
        if (!firstAdventure) {
            console.error('No adventures found in ADVENTURES data');
            return '';
        }

        return firstAdventure.id;
    }, [adventureStatuses, encounterResults, overrideAdventureId]);

    // Internal state for when no URL param is present
    const [internalActiveAdventureId, setInternalActiveAdventureId] = useState<string>(initialAdventure);

    // If override is provided (from URL), use that. Otherwise use internal state.
    const activeAdventureId = overrideAdventureId || internalActiveAdventureId;

    // We expose a setter that updates internal state. 
    // The consumer (ChronicleBook) must assume responsibility for navigation if they provided an override.
    const setActiveAdventureId = setInternalActiveAdventureId;

    const adventures = ADVENTURES;

    const currentAdventureIndex = useMemo(() =>
        resolveCurrentAdventureIndex(adventures, activeAdventureId)
        , [adventures, activeAdventureId]);

    const currentAdventure = adventures[currentAdventureIndex];

    return {
        adventures,
        currentAdventureIndex,
        currentAdventure,
        encounterResults,
        activeAdventureId,
        setActiveAdventureId
    };
};
