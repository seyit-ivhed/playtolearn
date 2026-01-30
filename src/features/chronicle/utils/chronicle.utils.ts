import { ADVENTURES } from '../../../data/adventures.data';
import { VOLUMES } from '../../../data/volumes.data';
import type { Adventure, Volume } from '../../../types/adventure.types';
import type { TFunction } from 'i18next';

/**
 * Gets the current volume based on an adventure ID.
 * Defaults to the first volume if not found.
 */
export const resolveCurrentVolume = (adventureId?: string): Volume => {
    if (!adventureId) {
        return VOLUMES[0];
    }

    const adventure = ADVENTURES.find(a => a.id === adventureId);
    if (!adventure?.volumeId) {
        return VOLUMES[0];
    }

    return VOLUMES.find(v => v.id === adventure.volumeId) || VOLUMES[0];
};

/**
 * Gets the list of adventures for a volume.
 */
export const resolveVolumeAdventures = (volume: Volume): Adventure[] => {
    // Filter adventures that belong to this volume using volumeId from the adventure data
    // This makes adventures.data.ts the source of truth
    return ADVENTURES.filter(a => a.volumeId === volume.id);
};

/**
 * Gets the index of the current adventure within the volume's adventures.
 */
export const resolveCurrentAdventureIndex = (adventures: Adventure[], adventureId?: string): number => {
    const idx = adventures.findIndex(a => a.id === adventureId);
    return idx !== -1 ? idx : 0;
};

/**
 * Generates a mapping of adventure IDs to their translated titles.
 */
export const generateAdventureTitles = (t: TFunction): Record<string, string> => {
    return ADVENTURES.reduce((acc, a) => {
        acc[a.id] = t(`adventures.${a.id}.title`, { defaultValue: a.title || t('chronicle.adventure_fallback', { id: a.id }) });
        return acc;
    }, {} as Record<string, string>);
};
