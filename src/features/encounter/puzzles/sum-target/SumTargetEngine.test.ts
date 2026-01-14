
import { describe, it, expect } from 'vitest';
import { calculateNextSum, formatActionLabel, isPuzzleSolved } from './SumTargetEngine';
import { type PuzzleOption } from '../../../../types/adventure.types';

describe('SumTargetEngine', () => {
    describe('calculateNextSum', () => {
        it('should handle simple addition with numbers', () => {
            expect(calculateNextSum(10, 5)).toBe(15);
            expect(calculateNextSum(10, -3)).toBe(7);
        });

        it('should handle ADD operation via PuzzleOption', () => {
            const option: PuzzleOption = { value: 5, type: 'ADD' };
            expect(calculateNextSum(10, option)).toBe(15);
        });

        it('should handle MULTIPLY operation', () => {
            const option: PuzzleOption = { value: 2, type: 'MULTIPLY' };
            expect(calculateNextSum(10, option)).toBe(20);
        });

        it('should handle DIVIDE operation with flooring', () => {
            const option: PuzzleOption = { value: 2, type: 'DIVIDE' };
            expect(calculateNextSum(10, option)).toBe(5);
            expect(calculateNextSum(11, option)).toBe(5); // Math.floor(5.5)
        });
    });

    describe('formatActionLabel', () => {
        it('should format simple numbers', () => {
            expect(formatActionLabel(5)).toBe('+5');
            expect(formatActionLabel(-3)).toBe('-3');
        });

        it('should use explicit label if provided', () => {
            const option: PuzzleOption = { value: 2, type: 'MULTIPLY', label: 'Double It!' };
            expect(formatActionLabel(option)).toBe('Double It!');
        });

        it('should format MULTIPLY type correctly', () => {
            const option: PuzzleOption = { value: 3, type: 'MULTIPLY' };
            expect(formatActionLabel(option)).toBe('x3');
        });

        it('should format DIVIDE type correctly', () => {
            const option: PuzzleOption = { value: 2, type: 'DIVIDE' };
            expect(formatActionLabel(option)).toBe('÷2');
        });
    });

    describe('isPuzzleSolved', () => {
        it('should return true when target is reached', () => {
            expect(isPuzzleSolved(50, 50)).toBe(true);
        });

        it('should return false when target is not reached', () => {
            expect(isPuzzleSolved(49, 50)).toBe(false);
            expect(isPuzzleSolved(51, 50)).toBe(false);
        });
    });
});
