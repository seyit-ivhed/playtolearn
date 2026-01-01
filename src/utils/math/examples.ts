/**
 * Provides static math challenge examples for each difficulty level.
 * These are used in the UI to show players what to expect.
 */
export const getDifficultyExamples = (level: number): string[] => {
    switch (level) {
        case 1:
            return ['3 + 3', '7 + 1', '4 + 2', '5 + 2'];
        case 2:
            return ['12 + 8', '15 + 5', '9 - 2', '10 - 3'];
        case 3:
            return ['24 + 16', '15 - 7', '4 × 3', '5 × 2'];
        case 4:
            return ['65 + 35', '82 - 14', '7 × 8', '48 ÷ 6'];
        case 5:
            return ['320 + 150', '450 - 200', '12 × 9', '73 ÷ 8'];
        default:
            return [];
    }
};
