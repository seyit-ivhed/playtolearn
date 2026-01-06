import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../../stores/game/store';
import {
    resolveCurrentVolume,
    resolveVolumeAdventures,
    resolveCurrentAdventureIndex,
    generateAdventureTitles
} from '../utils/chronicle.utils';

export const useChronicleData = () => {
    const { chronicle, encounterResults } = useGameStore();
    const { t } = useTranslation();

    const currentVolume = useMemo(() =>
        resolveCurrentVolume(chronicle.lastViewedVolumeId)
        , [chronicle.lastViewedVolumeId]);

    const volumeAdventures = useMemo(() =>
        resolveVolumeAdventures(currentVolume, t)
        , [currentVolume, t]);

    const currentAdventureIndex = useMemo(() =>
        resolveCurrentAdventureIndex(volumeAdventures, chronicle.lastViewedAdventureId)
        , [volumeAdventures, chronicle.lastViewedAdventureId]);

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
        encounterResults
    };
};
