import { type DifficultyLevel } from '../../../../types/math.types';
import { PuzzleType, type PuzzleData } from '../../../../types/adventure.types';
import { getRandomInt } from '../../../../utils/math/helpers';

/**
 * Core engine for the Balance (Weighing Rocks) puzzle.
 * Encapsulates logic for balancing weights on a scale.
 */

export const generateBalanceData = (difficulty: DifficultyLevel): PuzzleData => {
    // For a true "Balance" feel where user uses both sides:
    // Determine a Target Total (T) that both sides must reach.
    // Initialize Left at StartL < T.
    // Initialize Right at StartR < T.

    // Target Total e.g. 20-50 range
    const targetTotal = difficulty * 8 + getRandomInt(10, 20);

    // Initial weights (randomly filled 0-40% of target)
    const initialLeftWeight = getRandomInt(0, Math.floor(targetTotal * 0.4));
    const initialRightWeight = getRandomInt(0, Math.floor(targetTotal * 0.4));

    const neededLeft = targetTotal - initialLeftWeight;
    const neededRight = targetTotal - initialRightWeight;

    // Generate valid weights explicitly for Left
    const leftOptions: number[] = [];
    let remLeft = neededLeft;
    // Simplify: Level 1-2 maybe just 1 big weight needed? Or 2 small?
    // Let's stick to 2 chunks mostly to encourage addition.
    const numLeftWeights = neededLeft > 5 ? (difficulty <= 2 ? 1 : 2) : 1;

    for (let i = 0; i < numLeftWeights - 1; i++) {
        const w = getRandomInt(Math.floor(remLeft / 3), Math.floor(remLeft / 2));
        if (w > 0) {
            leftOptions.push(w);
            remLeft -= w;
        }
    }
    if (remLeft > 0) leftOptions.push(remLeft);

    // Generate valid weights explicitly for Right
    const rightOptions: number[] = [];
    let remRight = neededRight;
    const numRightWeights = neededRight > 5 ? (difficulty <= 2 ? 1 : 2) : 1;

    for (let i = 0; i < numRightWeights - 1; i++) {
        const w = getRandomInt(Math.floor(remRight / 3), Math.floor(remRight / 2));
        if (w > 0) {
            rightOptions.push(w);
            remRight -= w;
        }
    }
    if (remRight > 0) rightOptions.push(remRight);

    // Add decoys
    const numDecoys = difficulty <= 2 ? 1 : 2;
    for (let i = 0; i < numDecoys; i++) {
        leftOptions.push(getRandomInt(1, Math.floor(targetTotal / 4)));
        rightOptions.push(getRandomInt(1, Math.floor(targetTotal / 4)));
    }

    // Shuffle
    const shuffle = (arr: number[]) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    };
    shuffle(leftOptions);
    shuffle(rightOptions);

    return {
        puzzleType: PuzzleType.BALANCE,
        targetValue: targetTotal,
        options: [],
        initialLeftWeight,
        initialRightWeight,
        leftOptions,
        rightOptions
    };
};

/**
 * Calculates whether the scale is balanced.
 * Both sides must have equal weight.
 */
export const isBalanced = (leftWeight: number, rightWeight: number): boolean => {
    return leftWeight === rightWeight && leftWeight > 0;
};

/**
 * Calculates the total weight of a list of weights.
 */
export const calculateTotalWeight = (weights: number[]): number => {
    return weights.reduce((sum, w) => sum + w, 0);
};
