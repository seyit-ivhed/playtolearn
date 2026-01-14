import { describe, it, expect } from 'vitest';
import {
    calculateTotalDistributed,
    calculateRemainingGems,
    isValidAdjustment
} from './GuardianTributeEngine';

describe('GuardianTributeEngine', () => {
    describe('calculateTotalDistributed', () => {
        it('should sum up values correctly', () => {
            expect(calculateTotalDistributed([1, 2, 3])).toBe(6);
            expect(calculateTotalDistributed([0, 0, 0])).toBe(0);
            expect(calculateTotalDistributed([10])).toBe(10);
        });
    });

    describe('calculateRemainingGems', () => {
        it('should calculate remaining gems correctly', () => {
            expect(calculateRemainingGems([1, 2, 3], 10)).toBe(4);
            expect(calculateRemainingGems([5, 5], 10)).toBe(0);
            expect(calculateRemainingGems([0], 10)).toBe(10);
        });
    });

    describe('isValidAdjustment', () => {
        const currentValues = [5, 5];
        const totalGems = 15;

        it('should allow valid increment', () => {
            expect(isValidAdjustment(currentValues, 0, 1, totalGems)).toBe(true);
        });

        it('should allow valid decrement', () => {
            expect(isValidAdjustment(currentValues, 0, -1, totalGems)).toBe(true);
        });

        it('should reject decrement below zero', () => {
            expect(isValidAdjustment([0, 5], 0, -1, totalGems)).toBe(false);
        });

        it('should reject increment exceeding total gems', () => {
            expect(isValidAdjustment([10, 5], 0, 1, totalGems)).toBe(false);
        });

        it('should allow increment up to total gems', () => {
            expect(isValidAdjustment([9, 5], 0, 1, totalGems)).toBe(true);
        });
    });
});
