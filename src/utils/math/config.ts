import { type MathEngineConfig, type DifficultyLevel } from '../../types/math.types';

/**
 * Configuration for math problem generation ranges
 * Values based on common curriculum standards for ages 6-10
 */
export const CONFIG: MathEngineConfig = {
    level1: {
        addition: { enabled: true, left: { min: 0, max: 10 }, right: { min: 0, max: 10 } },
        subtraction: { enabled: false, left: { min: 0, max: 0 }, right: { min: 0, max: 0 } },
        multiplication: { enabled: false, left: { min: 0, max: 0 }, right: { min: 0, max: 0 } },
        division: { enabled: false, left: { min: 0, max: 0 }, right: { min: 0, max: 0 } },
    },
    level2: {
        addition: { enabled: true, left: { min: 5, max: 20 }, right: { min: 1, max: 10 } },
        subtraction: { enabled: true, left: { min: 5, max: 15 }, right: { min: 1, max: 6 } },
        multiplication: { enabled: false, left: { min: 0, max: 0 }, right: { min: 0, max: 0 } },
        division: { enabled: false, left: { min: 0, max: 0 }, right: { min: 0, max: 0 } },
    },
    level3: {
        addition: { enabled: true, left: { min: 10, max: 40 }, right: { min: 10, max: 40 } },
        subtraction: { enabled: true, left: { min: 10, max: 40 }, right: { min: 5, max: 40 } },
        multiplication: { enabled: true, left: { min: 2, max: 10 }, right: { min: 2, max: 5 } },
        division: { enabled: false, left: { min: 0, max: 0 }, right: { min: 0, max: 0 } },
    },
    level4: {
        addition: { enabled: true, left: { min: 50, max: 100 }, right: { min: 20, max: 50 } },
        subtraction: { enabled: true, left: { min: 50, max: 100 }, right: { min: 20, max: 50 } },
        multiplication: { enabled: true, left: { min: 4, max: 10 }, right: { min: 2, max: 10 } },
        division: {
            enabled: true,
            left: { min: 10, max: 50 },
            right: { min: 2, max: 5 },
            allowRemainder: false
        },
    },
    level5: {
        addition: { enabled: true, left: { min: 100, max: 600 }, right: { min: 100, max: 600 } },
        subtraction: { enabled: true, left: { min: 100, max: 600 }, right: { min: 50, max: 300 } },
        multiplication: { enabled: true, left: { min: 6, max: 12 }, right: { min: 2, max: 10 } },
        division: {
            enabled: true,
            left: { min: 20, max: 100 },
            right: { min: 2, max: 10 },
            allowRemainder: true
        },
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
        case 4: return CONFIG.level4;
        case 5: return CONFIG.level5;
        default: return CONFIG.level1;
    }
};
