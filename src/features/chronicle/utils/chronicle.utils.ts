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

/**
 * Determines the book state based on the URL pageId parameter.
 */
export const getBookStateFromUrl = (pageId?: string): 'COVER' | 'LOGIN' | 'DIFFICULTY' | 'ADVENTURE' => {
    if (!pageId || pageId === 'cover') {
        return 'COVER';
    }
    if (pageId === 'login') {
        return 'LOGIN';
    }
    if (pageId === 'difficulty') {
        return 'DIFFICULTY';
    }
    if (!isNaN(Number(pageId))) {
        return 'ADVENTURE';
    }
    return 'COVER';
};

/**
 * Calculates the z-index for pages in the 3D book view.
 * Unified stacking logic: lower position = closer to front in a closed book.
 */
export const calculatePageZIndex = (state: 'active' | 'flipped' | 'upcoming', position: number): number => {
    if (state === 'active') {
        return 100;
    }
    if (state === 'flipped') {
        // Most recently flipped (highest position) should be on top of left stack.
        return 10 + position;
    }
    // Next up in line (lowest position) should be on top of right stack.
    return 50 - position;
};
