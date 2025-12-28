
import { describe, it, expect } from 'vitest';
import { isBalanced, calculateScaleAngle, calculateTotalWeight } from './BalanceEngine';

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

    describe('calculateScaleAngle', () => {
        it('should return 0 when balanced', () => {
            expect(calculateScaleAngle(10, 10)).toBe(0);
        });

        it('should return positive angle when right is heavier', () => {
            const angle = calculateScaleAngle(5, 10);
            expect(angle).toBeGreaterThan(0);
            expect(angle).toBeLessThanOrEqual(15);
        });

        it('should return negative angle when left is heavier', () => {
            const angle = calculateScaleAngle(10, 5);
            expect(angle).toBeLessThan(0);
            expect(angle).toBeGreaterThanOrEqual(-15);
        });

        it('should clamp the angle to max 15 degrees', () => {
            expect(calculateScaleAngle(0, 100)).toBe(15);
            expect(calculateScaleAngle(100, 0)).toBe(-15);
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
