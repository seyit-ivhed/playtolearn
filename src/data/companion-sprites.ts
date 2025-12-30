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

export const COMPANION_SPRITES: Record<string, string[]> = {
    'amara': amaraImg,
    'tariq': tariqImg,
};

/**
 * Get sprite for a companion by ID and optionally level (for evolution)
 */
export const getCompanionSprite = (companionId: string, level: number = 1): string | undefined => {
    const sprites = COMPANION_SPRITES[companionId];
    if (!sprites) return undefined;

    // Milestone levels: 1-4 (Evo 0), 5-9 (Evo 1), 10-14 (Evo 2), 15+ (Evo 3)
    let evolutionIndex = 0;
    if (level >= 15) evolutionIndex = 3;
    else if (level >= 10) evolutionIndex = 2;
    else if (level >= 5) evolutionIndex = 1;

    // Fallback to highest available if index exceeds array length (preventing out of bounds)
    return sprites[evolutionIndex] || sprites[sprites.length - 1];
};
