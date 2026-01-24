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

// Unit Card Images
const amaraCardImg = [
    new URL('../assets/images/companions/Amara/unit-card/amara-0.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Amara/unit-card/amara-1.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Amara/unit-card/amara-2.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Amara/unit-card/amara-3.jpg', import.meta.url).href,
];

const tariqCardImg = [
    new URL('../assets/images/companions/Tariq/unit-card/tariq-0.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/unit-card/tariq-1.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/unit-card/tariq-2.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/unit-card/tariq-3.jpg', import.meta.url).href,
];

const kenjiCardImg = [
    new URL('../assets/images/companions/Kenji/unit-card/kenji-0.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/unit-card/kenji-1.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/unit-card/kenji-2.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/unit-card/kenji-3.jpg', import.meta.url).href,
];

import { getCompanionById } from './companions.data';

const COMPANION_SPRITES: Record<string, string[]> = {
    'amara': amaraImg,
    'tariq': tariqImg,
    'kenji': kenjiImg,
};

const COMPANION_CARD_IMAGES: Record<string, string[]> = {
    'amara': amaraCardImg,
    'tariq': tariqCardImg,
    'kenji': kenjiCardImg,
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

/**
 * Get unit card image (high-res) for a companion by ID and optionally level
 */
export const getCompanionCardImage = (companionId: string, level: number = 1): string | undefined => {
    const images = COMPANION_CARD_IMAGES[companionId];
    if (!images) return undefined;

    const data = getCompanionById(companionId);

    const evolutionIndex = data
        ? data.evolutions.filter(evo => level >= evo.atLevel).length
        : 0;

    return images[evolutionIndex] || images[images.length - 1];
};
