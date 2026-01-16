import {
    type DifficultyLevel,
} from '../types/math.types';
import { PuzzleType, type PuzzleData } from '../types/adventure.types';

export * from './math/helpers';
export * from './math/config';
export * from './math/operations';
export * from './math/choices';
export * from './math/validation';

import { generateSumTargetData } from '../features/encounter/puzzles/sum-target/SumTargetEngine';
import { generateBalanceData } from '../features/encounter/puzzles/balance/BalanceEngine';
import { generateSequenceData } from '../features/encounter/puzzles/sequence/SequenceEngine';
import { generateGuardianTributeData } from '../features/encounter/puzzles/guardian-tribute/GuardianTributeEngine';

/**
 * Mapping of puzzle types to their respective data generators
 */
const PUZZLE_GENERATORS: Record<PuzzleType, (difficulty: DifficultyLevel) => PuzzleData> = {
    [PuzzleType.SUM_TARGET]: generateSumTargetData,
    [PuzzleType.BALANCE]: generateBalanceData,
    [PuzzleType.SEQUENCE]: generateSequenceData,
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
