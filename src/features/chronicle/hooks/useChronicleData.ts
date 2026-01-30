import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ADVENTURES } from '../../../data/adventures.data';
import { useGameStore } from '../../../stores/game/store';
import { getHighestUnlockedAdventure } from '../../adventure/utils/navigation.utils';
import {
    resolveCurrentVolume,
    resolveVolumeAdventures,
    resolveCurrentAdventureIndex,
    generateAdventureTitles
} from '../utils/chronicle.utils';

export const useChronicleData = () => {
    const { encounterResults, adventureStatuses } = useGameStore();
    const { t } = useTranslation();

    // For new players (no progress), default to first adventure
    // For returning players, show their highest unlocked adventure
    const initialAdventure = useMemo(() => {
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
    }, [adventureStatuses, encounterResults]);

    const [activeAdventureId, setActiveAdventureId] = useState<string>(initialAdventure);

    const currentVolume = useMemo(() =>
        resolveCurrentVolume(activeAdventureId)
        , [activeAdventureId]);

    const volumeAdventures = useMemo(() =>
        resolveVolumeAdventures(currentVolume)
        , [currentVolume]);

    const currentAdventureIndex = useMemo(() =>
        resolveCurrentAdventureIndex(volumeAdventures, activeAdventureId)
        , [volumeAdventures, activeAdventureId]);

    const currentAdventure = volumeAdventures[currentAdventureIndex];

    const adventureTitles = useMemo(() =>
        generateAdventureTitles(t)
        , [t]);

    return {
        currentVolume,
        volumeAdventures,
        currentAdventureIndex,
        currentAdventure,
        adventureTitles,
        encounterResults,
        activeAdventureId,
        setActiveAdventureId
    };
};
