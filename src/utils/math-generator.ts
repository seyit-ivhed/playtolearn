import {
    type DifficultyLevel,
} from '../types/math.types';
import { PuzzleType, type PuzzleData } from '../types/adventure.types';

export * from './math/helpers';
export * from './math/config';
export * from './math/operations';
export * from './math/choices';
export * from './math/validation';

import { generateRefillCanteenData } from '../features/encounter/puzzles/refill-canteen/RefillCanteenEngine';
import { generateBalanceData } from '../features/encounter/puzzles/balance/BalanceEngine';
import { generateSequenceData } from '../features/encounter/puzzles/sequence/SequenceEngine';
import { generateMirrorData } from '../features/encounter/puzzles/mirror/MirrorEngine';
import { generateLatinSquareData } from '../features/encounter/puzzles/latin-square/LatinSquareEngine';
import { generateNumberPathData } from '../features/encounter/puzzles/number-path/NumberPathEngine';
import { generateEquationData } from '../features/encounter/puzzles/equation/EquationEngine';

/**
 * Mapping of puzzle types to their respective data generators
 */
const PUZZLE_GENERATORS: Record<PuzzleType, (difficulty: DifficultyLevel) => PuzzleData> = {
    [PuzzleType.REFILL_CANTEEN]: generateRefillCanteenData,
    [PuzzleType.BALANCE]: generateBalanceData,
    [PuzzleType.SEQUENCE]: generateSequenceData,
    [PuzzleType.MIRROR]: generateMirrorData,
    [PuzzleType.LATIN_SQUARE]: generateLatinSquareData,
    [PuzzleType.NUMBER_PATH]: generateNumberPathData,
    [PuzzleType.EQUATION]: generateEquationData,
};

/**
 * Generates puzzle data based on puzzle type and difficulty
 */
export const generatePuzzleData = (
    puzzleType: PuzzleType,
    difficulty: DifficultyLevel
): PuzzleData => {
    if (!puzzleType) {
        console.error('Puzzle type is missing in generatePuzzleData');
        throw new Error('Puzzle type is required');
    }

    if (!difficulty || typeof difficulty !== 'number') {
        console.error(`Invalid difficulty level: ${difficulty}`);
        throw new Error('Valid difficulty level is required');
    }

    const generator = PUZZLE_GENERATORS[puzzleType];

    if (generator) {
        return generator(difficulty);
    }

    console.error(`No generator found for puzzle type: ${puzzleType}`);
    throw new Error(`Unsupported puzzle type: ${puzzleType}`);
};
