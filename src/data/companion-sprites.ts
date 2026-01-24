/**
 * Companion Image Mappings
 * This file maps companion IDs to their sprite images for UI rendering.
 * Kept separate from data files to avoid Node.js import issues with image assets.
 */

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

// Camp Site Images
const amaraCampImg = [
    new URL('../assets/images/companions/Amara/camp-site/amara-0.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Amara/camp-site/amara-1.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Amara/camp-site/amara-2.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Amara/camp-site/amara-3.jpg', import.meta.url).href,
];

const tariqCampImg = [
    new URL('../assets/images/companions/Tariq/camp-site/tariq-0.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/camp-site/tariq-1.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/camp-site/tariq-2.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/camp-site/tariq-3.jpg', import.meta.url).href,
];

const kenjiCampImg = [
    new URL('../assets/images/companions/Kenji/camp-site/kenji-0.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/camp-site/kenji-1.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/camp-site/kenji-2.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/camp-site/kenji-3.jpg', import.meta.url).href,
];

// Level Up Images
const amaraLevelUpImg = [
    new URL('../assets/images/companions/Amara/level-up/amara-0.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Amara/level-up/amara-1.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Amara/level-up/amara-2.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Amara/level-up/amara-3.jpg', import.meta.url).href,
];

const tariqLevelUpImg = [
    new URL('../assets/images/companions/Tariq/level-up/tariq-0.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/level-up/tariq-1.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/level-up/tariq-2.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Tariq/level-up/tariq-3.jpg', import.meta.url).href,
];

const kenjiLevelUpImg = [
    new URL('../assets/images/companions/Kenji/level-up/kenji-0.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/level-up/kenji-1.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/level-up/kenji-2.jpg', import.meta.url).href,
    new URL('../assets/images/companions/Kenji/level-up/kenji-3.jpg', import.meta.url).href,
];

import { getCompanionById } from './companions.data';

const COMPANION_CARD_IMAGES: Record<string, string[]> = {
    'amara': amaraCardImg,
    'tariq': tariqCardImg,
    'kenji': kenjiCardImg,
};

const COMPANION_CAMP_IMAGES: Record<string, string[]> = {
    'amara': amaraCampImg,
    'tariq': tariqCampImg,
    'kenji': kenjiCampImg,
};

const COMPANION_LEVEL_UP_IMAGES: Record<string, string[]> = {
    'amara': amaraLevelUpImg,
    'tariq': tariqLevelUpImg,
    'kenji': kenjiLevelUpImg,
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

/**
 * Get camp site image for a companion by ID and optionally level
 */
export const getCompanionCampImage = (companionId: string, level: number = 1): string | undefined => {
    const images = COMPANION_CAMP_IMAGES[companionId];
    if (!images) return undefined;

    const data = getCompanionById(companionId);

    const evolutionIndex = data
        ? data.evolutions.filter(evo => level >= evo.atLevel).length
        : 0;

    return images[evolutionIndex] || images[images.length - 1];
};

/**
 * Get level up image (wide-res) for a companion by ID and optionally level
 */
export const getCompanionLevelUpImage = (companionId: string, level: number = 1): string | undefined => {
    const images = COMPANION_LEVEL_UP_IMAGES[companionId];
    if (!images) return undefined;

    const data = getCompanionById(companionId);

    const evolutionIndex = data
        ? data.evolutions.filter(evo => level >= evo.atLevel).length
        : 0;

    return images[evolutionIndex] || images[images.length - 1];
};
