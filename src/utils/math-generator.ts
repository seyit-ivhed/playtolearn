import {
    type DifficultyLevel,
} from '../types/math.types';
import { PuzzleType, type PuzzleData } from '../types/adventure.types';

export * from './math/helpers';
export * from './math/config';
export * from './math/operations';
export * from './math/choices';
export * from './math/validation';
export * from './math/puzzles/sum-target';
export * from './math/puzzles/balance';
export * from './math/puzzles/sequence';

import { generateSumTargetData } from './math/puzzles/sum-target';
import { generateBalanceData } from './math/puzzles/balance';
import { generateSequenceData } from './math/puzzles/sequence';

/**
 * Generates puzzle data based on puzzle type and difficulty
 */
export const generatePuzzleData = (
    puzzleType: PuzzleType,
    difficulty: DifficultyLevel
): PuzzleData => {
    switch (puzzleType) {
        case PuzzleType.SUM_TARGET:
            return generateSumTargetData(difficulty);
        case PuzzleType.BALANCE:
            return generateBalanceData(difficulty);
        case PuzzleType.SEQUENCE:
            return generateSequenceData(difficulty);
        default:
            return {
                puzzleType: PuzzleType.SUM_TARGET,
                targetValue: 10,
                options: [2, 3, 5]
            };
    }
};
