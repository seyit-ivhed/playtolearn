/**
 * Monster Image Mappings
 * This file maps monster IDs to their sprite images for UI rendering.
 * Kept separate from data files to avoid Node.js import issues with image assets.
 */

import duneScorpionImg from '../assets/images/enemies/dune-scorpion.png';
import sandSpiritImg from '../assets/images/enemies/sand-spirit.png';
import scorpionRaiderImg from '../assets/images/enemies/scorpion-raider.jpg';
import tinyScorpionImg from '../assets/images/enemies/tiny-scorpion.jpg';
import sandColossusImg from '../assets/images/enemies/the-sand-colossus.jpg';

export const MONSTER_SPRITES: Record<string, string> = {
    'scorpion_1': duneScorpionImg,
    'tiny_scorpion': tinyScorpionImg,
    'scorpion_raider': scorpionRaiderImg,
    'sand_spirit_1': sandSpiritImg,
    'sand_colossus': sandColossusImg,
};

/**
 * Get sprite for a monster by ID
 */
export const getMonsterSprite = (monsterId: string): string | undefined => {
    return MONSTER_SPRITES[monsterId];
};
