import { type MathEngineConfig, type DifficultyLevel } from '../../types/math.types';

/**
 * Configuration for math problem generation ranges
 * Values based on common curriculum standards for ages 6-10
 */
export const CONFIG: MathEngineConfig = {
    level1: {
        addition: { min: 0, max: 10 },
        subtraction: { min: 0, max: 0 }, // Disabled
        multiplication: { min: 0, max: 0 }, // Disabled
        division: { divisorMax: 0 }, // Disabled
    },
    level2: {
        addition: { min: 5, max: 20 },
        subtraction: { min: 1, max: 10 },
        multiplication: { min: 0, max: 0 }, // Disabled
        division: { divisorMax: 0 }, // Disabled
    },
    level3: {
        addition: { min: 10, max: 40 },
        subtraction: { min: 5, max: 40 },
        multiplication: { min: 2, max: 10 },
        division: { divisorMax: 0 }, // Disabled
    },
    level4: {
        addition: { min: 50, max: 100 },
        subtraction: { min: 20, max: 100 },
        multiplication: { min: 4, max: 10 },
        division: {
            divisorMax: 10,
            divisorMin: 2,
            quotientMin: 5,
            quotientMax: 10,
            allowRemainder: false
        },
    },
    level5: {
        addition: { min: 100, max: 600 },
        subtraction: { min: 100, max: 600 },
        multiplication: { min: 6, max: 12 },
        division: {
            divisorMax: 10,
            divisorMin: 2,
            quotientMin: 3,
            quotientMax: 10,
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
