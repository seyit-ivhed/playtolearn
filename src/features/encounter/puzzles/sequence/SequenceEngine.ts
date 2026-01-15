import { type DifficultyLevel } from '../../../../types/math.types';
import { PuzzleType, type PuzzleData } from '../../../../types/adventure.types';
import { getRandomInt } from '../../../../utils/math/helpers';

interface StarPosition {
    x: number;
    y: number;
}

/**
 * Validates if the next selected value is the correct next step in the sequence.
 * 
 * @param currentValues The array of values currently in the chain (in order)
 * @param nextValue The value the user is trying to add
 * @param rules Array of rule strings (e.g., "MULTIPLES_OF_2")
 * @returns boolean
 */
export const validateNextStep = (
    currentValues: number[],
    nextValue: number,
    rules: string[] = []
): boolean => {
    // If no rules provided, valid if it's strictly greater than the last one? 
    // Or maybe we treat it as simple increment by 1 if no rule.
    // For now, let's look at the first rule.
    const rule = rules[0] || '';

    // If starting a fresh chain
    if (currentValues.length === 0) {
        // Validation for the FIRST item depends on the rule.
        // e.g. "MULTIPLES_OF_2" -> starts at 2
        return isValidFirstStep(nextValue, rule);
    }

    const lastValue = currentValues[currentValues.length - 1];

    // 1. Arithmetic Progression: ADD_N
    if (rule.startsWith('ADD_') || rule.startsWith('MULTIPLES_OF_')) {
        // Support legacy MULTIPLES_OF as alias for ADD logic, though typically starts at 0 or step
        const suffix = rule.startsWith('ADD_') ? rule.replace('ADD_', '') : rule.replace('MULTIPLES_OF_', '');
        const step = parseInt(suffix, 10);
        return nextValue === lastValue + step;
    }

    // 2. Geometric Progression: MULTIPLY_N
    if (rule.startsWith('MULTIPLY_')) {
        const factor = parseInt(rule.replace('MULTIPLY_', ''), 10);
        return nextValue === lastValue * factor;
    }

    // Default fallback: Increment by 1
    return nextValue === lastValue + 1;
};

const isValidFirstStep = (value: number, rule: string): boolean => {
    // For ADD_N, we usually start at X (e.g. Start at 5, Add 3).
    // But since our generator creates the options, the "First" valid option 
    // is just the smallest one in the set usually.
    // However, validation relies on "Previous". 
    // If it's the very first click, we might accept ANY number if we assume the user 
    // can start the sequence anywhere?
    // OR we check if it matches the 'start' logic of the puzzle.

    // STRICT MODE:
    // If rule is MULTIPLES_OF_X, start must be X.
    if (rule.startsWith('MULTIPLES_OF_')) {
        const step = parseInt(rule.replace('MULTIPLES_OF_', ''), 10);
        return value === step;
    }

    // For generic ADD or MULTIPLY, we might just let them start anywhere 
    // as long as subsequent steps follow the rule?
    // Simplify: ALWAYS Allow the first click to be valid?
    // Risk: User clicks the middle of a chain.
    // Solution: The generator should perhaps provide the "Start Value" in the rules or data?
    // For now, let's assume the Start Value is the smallest number in the options.
    return true;
};

/**
 * Checks if the sequence has reached the required target value.
 */
export const isSequenceComplete = (
    currentValues: number[],
    targetValue: number
): boolean => {
    if (currentValues.length === 0) return false;
    const lastValue = currentValues[currentValues.length - 1];
    return lastValue >= targetValue;
};

/**
 * Generates random positions for stars ensuring they don't overlap too much.
 * Returns coordinates as percentages (0-100) to be responsive.
 */
export const generateStarPositions = (
    count: number,
    safeMargin: number = 10 // Minimum distance in % between stars
): StarPosition[] => {
    const positions: StarPosition[] = [];
    const maxAttempts = 50;

    for (let i = 0; i < count; i++) {
        let attempts = 0;
        let valid = false;
        let pos = { x: 0, y: 0 };

        while (!valid && attempts < maxAttempts) {
            attempts++;
            // Generate random x,y between 10% and 90% to keep away from extreme edges
            pos = {
                x: Math.floor(Math.random() * 80) + 10,
                y: Math.floor(Math.random() * 80) + 10
            };

            // Check distance against existing positions
            valid = true;
            for (const existing of positions) {
                const dx = existing.x - pos.x;
                const dy = existing.y - pos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < safeMargin) {
                    valid = false;
                    break;
                }
            }
        }

        positions.push(pos);
    }

    return positions;
};

/**
 * Generates sequence-based puzzle data
 */
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
