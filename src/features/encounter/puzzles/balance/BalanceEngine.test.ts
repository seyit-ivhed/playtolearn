
import { describe, it, expect } from 'vitest';
import { isBalanced, calculateTotalWeight } from './BalanceEngine';

describe('BalanceEngine', () => {
    describe('isBalanced', () => {
        it('should return true when weights are equal and greater than zero', () => {
            expect(isBalanced(10, 10)).toBe(true);
            expect(isBalanced(25, 25)).toBe(true);
        });

        it('should return false when weights are unequal', () => {
            expect(isBalanced(10, 5)).toBe(false);
            expect(isBalanced(5, 10)).toBe(false);
        });

        it('should return false when both weights are zero', () => {
            expect(isBalanced(0, 0)).toBe(false);
        });
    });



    describe('calculateTotalWeight', () => {
        it('should sum up all weights', () => {
            expect(calculateTotalWeight([5, 10, 3])).toBe(18);
            expect(calculateTotalWeight([])).toBe(0);
            expect(calculateTotalWeight([10])).toBe(10);
        });
    });
});
