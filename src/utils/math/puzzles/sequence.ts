import { type DifficultyLevel } from '../../../types/math.types';
import { PuzzleType, type PuzzleData } from '../../../types/adventure.types';
import { getRandomInt } from '../helpers';

export const generateSequenceData = (difficulty: DifficultyLevel): PuzzleData => {
    // Choose sequence type based on difficulty
    // Level 1-2: Simple addition (ADD_1, ADD_2)
    // Level 3-4: Skip counting (ADD_3, ADD_5, MULTIPLES_OF_X)
    // Level 5: Geometric sequences (MULTIPLY_2)

    let ruleType: 'ADD' | 'MULTIPLY';
    let step: number;
    let startValue: number;
    let count: number;

    if (difficulty <= 2) {
        // Simple arithmetic: +1 or +2
        ruleType = 'ADD';
        step = difficulty; // 1 or 2
        startValue = 1;
        count = 10;
    } else if (difficulty === 3) {
        // Skip counting: +2, +3, +5
        ruleType = 'ADD';
        const options = [2, 3, 5];
        step = options[getRandomInt(0, options.length - 1)];
        startValue = step; // Start at the step value for cleaner sequences
        count = 8;
    } else if (difficulty === 4) {
        // More complex skip counting or introduce multiplication
        const useMultiply = Math.random() > 0.7;
        if (useMultiply) {
            ruleType = 'MULTIPLY';
            step = 2; // Doubling
            startValue = 1;
            count = 6; // Geometric grows fast: 1, 2, 4, 8, 16, 32
        } else {
            ruleType = 'ADD';
            step = getRandomInt(3, 7);
            startValue = step;
            count = 8;
        }
    } else {
        // Level 5: Geometric sequences or complex arithmetic
        const useMultiply = Math.random() > 0.5;
        if (useMultiply) {
            ruleType = 'MULTIPLY';
            step = getRandomInt(2, 3); // x2 or x3
            startValue = 1;
            count = step === 2 ? 7 : 5; // Adjust count based on growth rate
        } else {
            ruleType = 'ADD';
            step = getRandomInt(5, 10);
            startValue = step;
            count = 8;
        }
    }

    // Generate the valid sequence
    const validSequence: number[] = [];
    let current = startValue;

    for (let i = 0; i < count; i++) {
        validSequence.push(current);
        if (ruleType === 'ADD') {
            current += step;
        } else {
            current *= step;
        }
    }

    // Add decoy numbers that break the pattern
    const decoys: number[] = [];
    const numDecoys = difficulty <= 2 ? 2 : difficulty <= 3 ? 3 : 4;

    const minValid = validSequence[0];
    const maxValid = validSequence[validSequence.length - 1];
    // Allow players to establish pattern with first 3 numbers
    const minDecoyValue = validSequence.length >= 3 ? validSequence[2] : validSequence[0];

    for (let i = 0; i < numDecoys; i++) {
        let decoy: number;
        let attempts = 0;

        do {
            attempts++;
            if (ruleType === 'ADD') {
                const baseIndex = getRandomInt(Math.min(2, validSequence.length - 1), validSequence.length - 1);
                const offset = Math.random() > 0.5 ? 1 : -1;
                decoy = validSequence[baseIndex] + offset;
            } else {
                if (validSequence.length > 3) {
                    const baseIndex = getRandomInt(2, validSequence.length - 2);
                    const lower = validSequence[baseIndex];
                    const upper = validSequence[baseIndex + 1];
                    decoy = getRandomInt(lower + 1, upper - 1);
                } else {
                    decoy = maxValid + getRandomInt(1, step);
                }
            }
        } while (
            (decoy <= 0 ||
                decoy < minDecoyValue ||
                validSequence.includes(decoy) ||
                decoys.includes(decoy) ||
                decoy < minValid - step ||
                decoy > maxValid + step) &&
            attempts < 20
        );

        if (attempts < 20) {
            decoys.push(decoy);
        }
    }

    // Combine and shuffle
    const allOptions = [...validSequence, ...decoys];

    // Fisher-Yates shuffle
    for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    const targetValue = validSequence[validSequence.length - 1];
    const ruleName = ruleType === 'ADD' ? `ADD_${step}` : `MULTIPLY_${step}`;

    return {
        puzzleType: PuzzleType.SEQUENCE,
        targetValue,
        options: allOptions,
        rules: [ruleName]
    };
};
