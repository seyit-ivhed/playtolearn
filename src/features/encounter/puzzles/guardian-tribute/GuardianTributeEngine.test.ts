import { describe, it, expect } from 'vitest';
import {
    calculateTotalDistributed,
    calculateRemainingGems,
    isValidAdjustment,
    generateGuardianTributeData,
    validateGuardianConstraint,
    validateGuardianTributeSolution,
    GuardianConstraintType,
    type GuardianConstraint
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

    describe('generateGuardianTributeData', () => {
        it('should generate solutions that satisfy all constraints', () => {
            for (let difficulty = 1; difficulty <= 3; difficulty++) {
                const data = generateGuardianTributeData(difficulty as 1 | 2 | 3);
                const solutions = data.guardians.map(g => g.solution);

                data.guardians.forEach((guardian, index) => {
                    const isValid = validateGuardianConstraint(
                        solutions[index],
                        guardian.constraint,
                        solutions
                    );
                    expect(isValid).toBe(true);
                });
            }
        });

        it('should have valid solutions that sum to total gems', () => {
            for (let difficulty = 1; difficulty <= 3; difficulty++) {
                const data = generateGuardianTributeData(difficulty as 1 | 2 | 3);
                const sum = data.guardians.reduce((total, g) => total + g.solution, 0);
                expect(sum).toBe(data.totalGems);
            }
        });
    });

    describe('validateGuardianConstraint', () => {
        it('should validate EXACT constraint correctly', () => {
            const constraint: GuardianConstraint = {
                type: GuardianConstraintType.EXACT,
                value: 10
            };
            expect(validateGuardianConstraint(10, constraint, [])).toBe(true);
            expect(validateGuardianConstraint(9, constraint, [])).toBe(false);
        });

        it('should validate MULTIPLIER constraint correctly', () => {
            const constraint: GuardianConstraint = {
                type: GuardianConstraintType.MULTIPLIER,
                multiplier: 2,
                targetGuardian: 0
            };
            const guardianValues = [5, 10, 15];
            expect(validateGuardianConstraint(10, constraint, guardianValues)).toBe(true);
            expect(validateGuardianConstraint(9, constraint, guardianValues)).toBe(false);
        });
    });

    describe('validateGuardianTributeSolution', () => {
        it('should validate a correct solution', () => {
            const data = generateGuardianTributeData(2);
            const solutions = data.guardians.map(g => g.solution);

            const result = validateGuardianTributeSolution(solutions, data);
            expect(result.isValid).toBe(true);
        });

        it('should reject solution with wrong total gems', () => {
            const data = generateGuardianTributeData(2);
            const solutions = data.guardians.map(g => g.solution);
            solutions[0] += 5;

            const result = validateGuardianTributeSolution(solutions, data);
            expect(result.isValid).toBe(false);
            expect(result.allGemsDistributed).toBe(false);
        });
    });
});
