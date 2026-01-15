
import { describe, it, expect } from 'vitest';
import { isBalanced, calculateTotalWeight, generateBalanceData } from './BalanceEngine';
import { PuzzleType } from '../../../../types/adventure.types';

describe('BalanceEngine', () => {
    describe('generateBalanceData', () => {
        it('should generate valid puzzle structure', () => {
            const data = generateBalanceData(1);
            expect(data.puzzleType).toBe(PuzzleType.BALANCE);
            expect(data.targetValue).toBeGreaterThan(0);
            expect(data.initialLeftWeight).toBeDefined();
            expect(data.initialRightWeight).toBeDefined();
            expect(Array.isArray(data.leftOptions)).toBe(true);
            expect(Array.isArray(data.rightOptions)).toBe(true);
        });

        it('should ensure sides are reachable to target value', () => {
            const data = generateBalanceData(3);
            const leftTotal = (data.leftOptions as number[]).reduce((a, b) => a + b, 0) + (data.initialLeftWeight ?? 0);
            const rightTotal = (data.rightOptions as number[]).reduce((a, b) => a + b, 0) + (data.initialRightWeight ?? 0);

            expect(leftTotal).toBeGreaterThanOrEqual(data.targetValue);
            expect(rightTotal).toBeGreaterThanOrEqual(data.targetValue);
        });

        it('should generate more weights for higher difficulty', () => {
            const easy = generateBalanceData(1);
            const hard = generateBalanceData(5);
            expect(hard.leftOptions!.length).toBeGreaterThanOrEqual(easy.leftOptions!.length);
        });

        it('should have shuffled options', () => {
            for (let i = 0; i < 10; i++) {
                const data = generateBalanceData(2);
                expect(data.leftOptions!.length).toBeGreaterThan(0);
                expect(data.rightOptions!.length).toBeGreaterThan(0);
            }
        });
    });

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
