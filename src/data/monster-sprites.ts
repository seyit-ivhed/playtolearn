/**
 * Monster Image Mappings
 * This file maps monster IDs to their sprite images for UI rendering.
 * Kept separate from data files to avoid Node.js import issues with image assets.
 */

const duneScorpionImg = new URL('../assets/images/enemies/dune-scorpion.jpg', import.meta.url).href;
const sandSpiritImg = new URL('../assets/images/enemies/sand-spirit.jpg', import.meta.url).href;
const tinyScorpionImg = new URL('../assets/images/enemies/tiny-scorpion.jpg', import.meta.url).href;
const desertScavengerImg = new URL('../assets/images/enemies/desert-scavenger.jpg', import.meta.url).href;
const sandColossusImg = new URL('../assets/images/enemies/the-sand-colossus.jpg', import.meta.url).href;
const banditRaiderImg = new URL('../assets/images/enemies/bandit-raider.jpg', import.meta.url).href;
const stoneGuardianImg = new URL('../assets/images/enemies/stone-guardian.jpg', import.meta.url).href;
const assyrianGuardianImg = new URL('../assets/images/enemies/assyrian-guardian.jpg', import.meta.url).href;
const theStoneEmperorImg = new URL('../assets/images/enemies/the-stone-emperor.jpg', import.meta.url).href;
const banditLeaderImg = new URL('../assets/images/enemies/bandit-leader.jpg', import.meta.url).href;

const MONSTER_SPRITES: Record<string, string> = {
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
