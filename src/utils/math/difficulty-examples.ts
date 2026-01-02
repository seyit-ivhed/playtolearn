/**
 * Returns example math problems for a given difficulty level.
 * Used for UI display and boundary testing.
 * 
 * @param level - The difficulty level (1-5)
 * @returns An array of math problem strings
 */
export const getDifficultyExamples = (level: number): string[] => {
    switch (level) {
        case 1: return ['3 + 3', '7 + 1', '4 + 2'];
        case 2: return ['12 + 8', '15 + 5', '9 - 2'];
        case 3: return ['24 + 16', '15 - 7', '4 × 3'];
        case 4: return ['65 + 35', '82 - 14', '7 × 8', '48 ÷ 6'];
        case 5: return ['320 + 150', '450 - 200', '12 × 9', '73 ÷ 8'];
        default: return [];
    }
};
