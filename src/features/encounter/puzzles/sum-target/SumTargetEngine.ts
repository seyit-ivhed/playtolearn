
import { type PuzzleOption } from '../../../../types/adventure.types';

/**
 * Core engine for the Sum Target (Water Flow) puzzle.
 * Encapsulates calculation and logic for unit testing.
 */

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
        case 'DIVIDE':
            // Using Math.floor to ensure whole numbers in the reservoir
            return Math.floor(currentSum / value);
        case 'ADD':
        default:
            return currentSum + value;
    }
};

/**
 * Formats the action label for feedback (e.g. "+5", "x2", "÷2")
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
        case 'DIVIDE':
            return `÷${value}`;
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
