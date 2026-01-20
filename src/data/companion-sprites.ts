/**
 * Companion Image Mappings
 * This file maps companion IDs to their sprite images for UI rendering.
 * Kept separate from data files to avoid Node.js import issues with image assets.
 */

const amaraImg = [
    new URL('../assets/images/companions/Amara/Amara-0.png', import.meta.url).href,
    new URL('../assets/images/companions/Amara/Amara-1.png', import.meta.url).href,
    new URL('../assets/images/companions/Amara/Amara-2.png', import.meta.url).href,
    new URL('../assets/images/companions/Amara/Amara-3.png', import.meta.url).href,
];
const tariqImg = [
    new URL('../assets/images/companions/Tariq/Tariq-0.png', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/Tariq-1.png', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/Tariq-2.png', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/Tariq-3.png', import.meta.url).href,
];

const kenjiImg = [
    new URL('../assets/images/companions/Kenji/Kenji-0.png', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/Kenji-1.png', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/Kenji-2.png', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/Kenji-3.png', import.meta.url).href,
];

import { getCompanionById } from './companions.data';

const COMPANION_SPRITES: Record<string, string[]> = {
    'amara': amaraImg,
    'tariq': tariqImg,
    'kenji': kenjiImg,
};

/**
 * Get sprite for a companion by ID and optionally level (for evolution)
 */
export const getCompanionSprite = (companionId: string, level: number = 1): string | undefined => {
    const sprites = COMPANION_SPRITES[companionId];
    if (!sprites) return undefined;

    const data = getCompanionById(companionId);

    // Dynamically calculate evolution index based on milestones in data
    const evolutionIndex = data
        ? data.evolutions.filter(evo => level >= evo.atLevel).length
        : 0;

    // Fallback to highest available if index exceeds array length (preventing out of bounds)
    return sprites[evolutionIndex] || sprites[sprites.length - 1];
};
