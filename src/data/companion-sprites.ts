/**
 * Companion Image Mappings
 * This file maps companion IDs to their sprite images for UI rendering.
 * Kept separate from data files to avoid Node.js import issues with image assets.
 */

import amaraImg from '../assets/images/companions/Amara/Amara-0.png';
import tariqImg from '../assets/images/companions/Tariq/Tariq-0.png';

export const COMPANION_SPRITES: Record<string, string> = {
    'amara': amaraImg,
    'tariq': tariqImg,
};

/**
 * Get sprite for a companion by ID
 */
export const getCompanionSprite = (companionId: string): string | undefined => {
    return COMPANION_SPRITES[companionId];
};
