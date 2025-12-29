/**
 * Monster Image Mappings
 * This file maps monster IDs to their sprite images for UI rendering.
 * Kept separate from data files to avoid Node.js import issues with image assets.
 */

import duneScorpionImg from '../assets/images/enemies/dune-scorpion.png';
import sandSpiritImg from '../assets/images/enemies/sand-spirit.png';
import tinyScorpionImg from '../assets/images/enemies/tiny-scorpion.jpg';
import desertScavengerImg from '../assets/images/enemies/desert-scavenger.png';
import sandColossusImg from '../assets/images/enemies/the-sand-colossus.jpg';
import banditRaiderImg from '../assets/images/enemies/bandit-raider.png';
import stoneGuardianImg from '../assets/images/enemies/stone-guardian.png';
import assyrianGuardianImg from '../assets/images/enemies/assyrian-guardian.png';
import theStoneEmperorImg from '../assets/images/enemies/the-stone-emperor.png';
import banditLeaderImg from '../assets/images/enemies/bandit-leader.png';


export const MONSTER_SPRITES: Record<string, string> = {
    'scorpion_1': duneScorpionImg,
    'tiny_scorpion': tinyScorpionImg,
    'desert_scavenger': desertScavengerImg,
    'sand_spirit_1': sandSpiritImg,
    'sand_colossus': sandColossusImg,
    'bandit_raider': banditRaiderImg,
    'stone_guardian': stoneGuardianImg,
    'assyrian_guardian': assyrianGuardianImg,
    'the_stone_emperor': theStoneEmperorImg,
    'bandit_leader': banditLeaderImg,
};

/**
 * Get sprite for a monster by ID
 */
export const getMonsterSprite = (monsterId: string): string | undefined => {
    return MONSTER_SPRITES[monsterId];
};
