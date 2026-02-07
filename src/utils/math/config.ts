import { type MathEngineConfig, type DifficultyLevel } from '../../types/math.types';

/**
 * Configuration for math problem generation ranges
 * Values based on common curriculum standards for ages 6-10
 */
export const CONFIG: MathEngineConfig = {
    level1: {
        addition: { enabled: true, left: { min: 1, max: 10 }, right: { min: 1, max: 5 } },
        subtraction: { enabled: true, left: { min: 3, max: 10 }, right: { min: 1, max: 3 } },
        multiplication: { enabled: false, left: { min: 0, max: 0 }, right: { min: 0, max: 0 } },
    },
    level2: {
        addition: { enabled: true, left: { min: 5, max: 20 }, right: { min: 1, max: 10 } },
        subtraction: { enabled: true, left: { min: 10, max: 20 }, right: { min: 5, max: 10 } },
        multiplication: { enabled: true, left: { min: 2, max: 5 }, right: { min: 1, max: 3 } }, // Intro to doubling
    },
    level3: {
        addition: { enabled: true, left: { min: 10, max: 50 }, right: { min: 10, max: 50 } },
        subtraction: { enabled: true, left: { min: 20, max: 50 }, right: { min: 5, max: 15 } },
        multiplication: { enabled: true, left: { min: 3, max: 10 }, right: { min: 2, max: 5 } }, // x2, x3, x4, x5
    },
};

/**
 * Retrieves setting for a specific difficulty level
 */
export const getSettings = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
        case 1: return CONFIG.level1;
        case 2: return CONFIG.level2;
        case 3: return CONFIG.level3;
        default: return CONFIG.level1;
    }
};
