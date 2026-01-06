import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../../stores/game/store';
import { useAdventureStore } from '../../../stores/adventure.store';
import { getHighestUnlockedAdventure } from '../../adventure/utils/navigation.utils';
import {
    resolveCurrentVolume,
    resolveVolumeAdventures,
    resolveCurrentAdventureIndex,
    generateAdventureTitles
} from '../utils/chronicle.utils';

export const useChronicleData = () => {
    const { encounterResults } = useGameStore();
    const { adventureStatuses } = useAdventureStore();
    const { t } = useTranslation();

    // Default to the highest unlocked adventure if none specified
    const initialAdventure = useMemo(() =>
        getHighestUnlockedAdventure(adventureStatuses).adventureId
        , [adventureStatuses]);

    const [activeAdventureId, setActiveAdventureId] = useState<string>(initialAdventure);

    const currentVolume = useMemo(() =>
        resolveCurrentVolume(activeAdventureId)
        , [activeAdventureId]);

    const volumeAdventures = useMemo(() =>
        resolveVolumeAdventures(currentVolume, t)
        , [currentVolume, t]);

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
