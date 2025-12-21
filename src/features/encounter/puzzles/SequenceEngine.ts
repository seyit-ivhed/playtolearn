import type { PuzzleOption } from '../../../types/adventure.types';

export interface StarPosition {
    x: number;
    y: number;
}

export interface SequenceState {
    currentPath: number[]; // Indices of selected options
    isComplete: boolean;
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

    if (rule.startsWith('MULTIPLES_OF_')) {
        const step = parseInt(rule.replace('MULTIPLES_OF_', ''), 10);

        // Next value must be exactly (lastValue + step)
        return nextValue === lastValue + step;
    }

    // Default fallback: Increment by 1
    return nextValue === lastValue + 1;
};

const isValidFirstStep = (value: number, rule: string): boolean => {
    if (rule.startsWith('MULTIPLES_OF_')) {
        const step = parseInt(rule.replace('MULTIPLES_OF_', ''), 10);
        return value === step;
    }
    // Default
    return value === 1; // Or whatever the smallest number is?
    // Actually, usually 1 or the start of the sequence.
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
