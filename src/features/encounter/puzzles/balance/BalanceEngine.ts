import type { DifficultyLevel } from '../../../../types/math.types';
import { PuzzleType, type PuzzleData } from '../../../../types/adventure.types';
import { getRandomInt, shuffleArray } from '../../../../utils/math/helpers';

export interface Weight {
    id: string;
    value: number;
    isHeavy: boolean;
    // Helper property to visualize unique weights if needed, 
    // or we can rely on ID/index for React keys.
}

export interface BalancePuzzleData extends PuzzleData {
    leftStack: Weight[];
    rightStack: Weight[];
    targetBalance: number; // The sum required on each side to solve (internal target)
}

/**
 * Calculates the total weight of a stack.
 */
export const calculateTotalWeight = (stack: Weight[]): number => {
    return stack.reduce((sum, w) => sum + w.value, 0);
};

/**
 * Checks if the current state is balanced.
 */
export const validateBalance = (
    leftStack: Weight[],
    rightStack: Weight[]
): boolean => {
    const leftSum = calculateTotalWeight(leftStack);
    const rightSum = calculateTotalWeight(rightStack);
    return leftSum === rightSum && leftSum > 0;
};

/**
 * Generates data for the Balance Puzzle.
 * Strategy:
 * 1. Determine a "target balanced sum" for each side.
 * 2. Generate a solution set of weights for Left and Right that sum to Target.
 * 3. Place a Heavy Weight at the bottom of one stack (included in the solution sum).
 * 4. Generate "noise" weights (extra weights) and mix them into the solution stacks.
 * 5. Player must remove the noise weights to return to the balanced state.
 */
export const generateBalanceData = (difficulty: DifficultyLevel): BalancePuzzleData => {
    // 1. Config based on difficulty
    // Higher difficulty -> Higher values, more weights
    const minTarget = difficulty === 1 ? 5 : difficulty === 2 ? 10 : 15;
    const maxTarget = difficulty === 1 ? 10 : difficulty === 2 ? 20 : 35;
    const targetBalance = getRandomInt(minTarget, maxTarget);

    // Number of required weights per side (solution)
    const minSolutionWeights = 1;
    const maxSolutionWeights = difficulty === 1 ? 2 : 3;

    // Number of noise weights per side
    const noiseCount = difficulty === 1 ? 1 : 2;

    // 3. Generate Solution Sets

    // Helper to generate weights summing to a remainder
    const generateComponents = (target: number, count: number): number[] => {
        if (count <= 1) {
            return [target];
        }

        const result: number[] = [];
        let remainder = target;

        for (let i = 0; i < count - 1; i++) {
            // Ensure each weight is at least 1, and leaves room for remaining weights
            const max = remainder - (count - 1 - i);
            const val = getRandomInt(1, Math.max(1, Math.ceil(max / 2)));
            // Random distribution but biased keep numbers reasonable
            result.push(val);
            remainder -= val;
        }
        result.push(remainder);

        // Shuffle so big numbers aren't always last
        return shuffleArray(result);
    };

    // 2. Generate Heavy Weights
    // Both sides now have a heavy weight acting as a platform.
    // They should be heavy but unequal initially.
    const baseHeavy = Math.floor(targetBalance * 0.4);
    const heavyLeft: Weight = {
        id: `heavy-left-${Math.random().toString(36).substr(2, 9)}`,
        value: baseHeavy,
        isHeavy: true
    };
    const heavyRight: Weight = {
        id: `heavy-right-${Math.random().toString(36).substr(2, 9)}`,
        value: baseHeavy + getRandomInt(2, 5), // Ensure initial imbalance
        isHeavy: true
    };

    // Decide which side is "correct" for the solution total
    // The target balance is the sum of (heavy + solution weights)
    // We adjust the solution generation to account for the specific heavy weight on each side.
    const leftSolutionTotal = targetBalance;
    const rightSolutionTotal = targetBalance;

    const leftRemaining = leftSolutionTotal - heavyLeft.value;
    const rightRemaining = rightSolutionTotal - heavyRight.value;

    // Ensure we don't have negative remaining weight if target is too low
    const lCount = getRandomInt(minSolutionWeights, maxSolutionWeights);
    const rCount = getRandomInt(minSolutionWeights, maxSolutionWeights);

    const leftSolutionValues = generateComponents(Math.max(1, leftRemaining), lCount);
    const rightSolutionValues = generateComponents(Math.max(1, rightRemaining), rCount);

    // 4. Generate Noise Weights
    // Noise weights are random values that don't need to balance
    const generateNoise = (count: number): number[] => {
        const noise: number[] = [];
        for (let i = 0; i < count; i++) {
            noise.push(getRandomInt(1, Math.floor(targetBalance / 3)));
        }
        return noise;
    };

    const leftNoise = generateNoise(noiseCount);
    const rightNoise = generateNoise(noiseCount);

    // 5. Construct Final Stacks

    // Convert numbers to Weight objects
    const createWeights = (values: number[]): Weight[] => {
        return values.map(v => ({
            id: `w-${Math.random().toString(36).substr(2, 9)}`,
            value: v,
            isHeavy: false
        }));
    };

    let leftStack = createWeights([...leftSolutionValues, ...leftNoise]);
    let rightStack = createWeights([...rightSolutionValues, ...rightNoise]);

    // Shuffle stacks to mix noise and solution (except heavy)
    leftStack = shuffleArray(leftStack);
    rightStack = shuffleArray(rightStack);

    // Place Heavy Weights at bottom
    leftStack.unshift(heavyLeft);
    rightStack.unshift(heavyRight);

    return {
        puzzleType: PuzzleType.BALANCE, // Assuming this enum exists or mapped to generic
        targetValue: targetBalance, // Not strictly used for checking, just metadata
        options: [],
        leftStack,
        rightStack,
        targetBalance
    };
};
