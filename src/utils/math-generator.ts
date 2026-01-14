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
export * from './math/puzzles/guardian-tribute';

import { generateSumTargetData } from './math/puzzles/sum-target';
import { generateBalanceData } from './math/puzzles/balance';
import { generateSequenceData } from './math/puzzles/sequence';
import { generateGuardianTributeData } from './math/puzzles/guardian-tribute';

/**
 * Mapping of puzzle types to their respective data generators
 */
const PUZZLE_GENERATORS: Record<PuzzleType, (difficulty: DifficultyLevel) => PuzzleData> = {
    [PuzzleType.SUM_TARGET]: generateSumTargetData,
    [PuzzleType.BALANCE]: generateBalanceData,
    [PuzzleType.SEQUENCE]: generateSequenceData,
    [PuzzleType.CUNEIFORM]: (difficulty) => ({
        ...generateBalanceData(difficulty),
        puzzleType: PuzzleType.CUNEIFORM
    }),
    [PuzzleType.GUARDIAN_TRIBUTE]: generateGuardianTributeData,
};

/**
 * Generates puzzle data based on puzzle type and difficulty
 */
export const generatePuzzleData = (
    puzzleType: PuzzleType,
    difficulty: DifficultyLevel
): PuzzleData => {
    const generator = PUZZLE_GENERATORS[puzzleType];

    if (generator) {
        return generator(difficulty);
    }

    // Default fallback if type is not recognized
    return {
        puzzleType: PuzzleType.SUM_TARGET,
        targetValue: 10,
        options: [2, 3, 5]
    };
};
