import { type DifficultyLevel } from '../../../../types/math.types';
import { PuzzleType, type PuzzleData, type PuzzleOption } from '../../../../types/adventure.types';
import { getRandomInt } from '../../../../utils/math/helpers';

/**
 * Core engine for the Sum Target (Pipe Connections) puzzle.
 * Encapsulates logic for calculating sums and validating the solution.
 */

export const generateSumTargetData = (difficulty: DifficultyLevel): PuzzleData => {
    let current = 0;
    const solutionPipes: (number | PuzzleOption)[] = [];
    const decoyPipes: (number | PuzzleOption)[] = [];

    // 1. Choose number of solution steps based on difficulty
    let steps = 2;
    if (difficulty === 2) {
        steps = getRandomInt(2, 3);
    } else if (difficulty === 3) {
        steps = 3;
    }

    // 2. Build the solution path
    // Initial step: Always addition to get a base value
    const firstVal = (difficulty === 1) ? getRandomInt(3, 8) : getRandomInt(10, 20);
    current = firstVal;
    solutionPipes.push(firstVal);

    for (let i = 1; i < steps; i++) {
        const pool: ('ADD' | 'SUB' | 'MUL' | 'DIV')[] = ['ADD'];
        if (difficulty >= 2) {
            pool.push('SUB');
        }
        if (difficulty === 3) {
            pool.push('MUL'); // Intro to simple multiplication
        }

        const opType = pool[getRandomInt(0, pool.length - 1)];

        if (opType === 'ADD') {
            const val = (difficulty === 1) ? getRandomInt(1, 4) : getRandomInt(5, 15);
            current += val;
            solutionPipes.push(val);
        } else if (opType === 'SUB') {
            const val = (difficulty === 1) ? getRandomInt(1, 3) : getRandomInt(2, 10);
            // Non-destructive check to keep target positive and interesting
            if (current - val >= 1) {
                current -= val;
                solutionPipes.push(-val);
            } else {
                const fallback = getRandomInt(2, 5);
                current += fallback;
                solutionPipes.push(fallback);
            }
        } else if (opType === 'MUL') {
            const factor = 2; // Keep it at doubling for age 8 in this complex puzzle
            if (current * factor <= 100) {
                current *= factor;
                solutionPipes.push({ value: factor, type: 'MULTIPLY', label: `x${factor}` });
            } else {
                const subFallback = 5;
                current -= subFallback;
                solutionPipes.push(-subFallback);
            }
        }
    }

    // 3. Add decoy pipes to increase challenge
    const decoyCount = difficulty === 1 ? 1 : 2;
    for (let i = 0; i < decoyCount; i++) {
        if (difficulty === 1) {
            decoyPipes.push(getRandomInt(1, 4));
        } else {
            decoyPipes.push(Math.random() > 0.5 ? getRandomInt(1, 10) : -getRandomInt(1, 5));
        }
    }

    const allOptions = [...solutionPipes, ...decoyPipes];

    // 4. Shuffle all options (Fisher-Yates)
    for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    return {
        puzzleType: PuzzleType.SUM_TARGET,
        targetValue: current,
        options: allOptions.filter(o => typeof o === 'number' ? o !== 0 : o.value !== 0)
    };
};

/**
 * Calculates the next sum based on a pipe selection
 */
export const calculateNextSum = (currentSum: number, option: number | PuzzleOption): number => {
    if (typeof option === 'number') {
        return currentSum + option;
    }

    const { value, type } = option;

    switch (type) {
        case 'MULTIPLY':
            return currentSum * value;
        case 'ADD':
        default:
            return currentSum + value;
    }
};

/**
 * Formats the action label for feedback (e.g. "+5", "x2")
 */
export const formatActionLabel = (option: number | PuzzleOption): string => {
    if (typeof option === 'number') {
        return option > 0 ? `+${option}` : `${option}`;
    }

    const { value, type, label } = option;
    if (label) return label;

    switch (type) {
        case 'MULTIPLY':
            return `x${value}`;
        case 'ADD':
        default:
            return value > 0 ? `+${value}` : `${value}`;
    }
};

/**
 * Determines if the puzzle is solved
 */
export const isPuzzleSolved = (currentSum: number, targetValue: number): boolean => {
    return currentSum === targetValue;
};
