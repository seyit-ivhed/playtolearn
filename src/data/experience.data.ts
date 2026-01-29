export const EXPERIENCE_CONFIG = {
    XP_BASE: 100,
    XP_COEFFICIENT: 1.1,
    MAX_LEVEL: 15,
    STAT_SCALING_FACTOR: 0.1,
    ENCOUNTER_XP_REWARD: 130,
} as const;

export const getRequiredXpForNextLevel = (currentLevel: number): number => {
    if (currentLevel >= EXPERIENCE_CONFIG.MAX_LEVEL) return 0;
    return Math.floor(EXPERIENCE_CONFIG.XP_BASE * Math.pow(currentLevel, EXPERIENCE_CONFIG.XP_COEFFICIENT));
};
