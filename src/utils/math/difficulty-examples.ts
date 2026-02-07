/**
 * Returns example math problems for a given difficulty level.
 * Used for UI display and boundary testing.
 * 
 * @param level - The difficulty level (1-3)
 * @returns An array of math problem strings
 */
export const getDifficultyExamples = (level: number): string[] => {
    switch (level) {
        case 1: return ['3 + 3', '7 + 2', '8 - 3'];
        case 2: return ['12 + 6', '18 - 5', '5 × 3'];
        case 3: return ['45 + 32', '48 - 14', '9 × 5'];
        default: return [];
    }
};
