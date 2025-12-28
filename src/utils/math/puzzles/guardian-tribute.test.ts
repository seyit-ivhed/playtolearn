import { describe, it, expect } from 'vitest';
import {
    generateGuardianTributeData,
    validateGuardianConstraint,
    validateGuardianTributeSolution,
    GuardianConstraintType,
    type GuardianConstraint
} from './guardian-tribute';

describe('Guardian Tribute Puzzle', () => {
    describe('generateGuardianTributeData', () => {
        it('should generate 2 guardians for difficulty 1', () => {
            const data = generateGuardianTributeData(1);
            expect(data.guardians).toHaveLength(2);
            expect(data.totalGems).toBeGreaterThan(0);
        });

        it('should generate 3 guardians for difficulty 2', () => {
            const data = generateGuardianTributeData(2);
            expect(data.guardians).toHaveLength(3);
            expect(data.totalGems).toBeGreaterThan(0);
        });

        it('should generate 3 guardians for difficulty 3', () => {
            const data = generateGuardianTributeData(3);
            expect(data.guardians).toHaveLength(3);
            expect(data.totalGems).toBeGreaterThan(0);
        });

        it('should generate 4 guardians for difficulty 4', () => {
            const data = generateGuardianTributeData(4);
            expect(data.guardians).toHaveLength(4);
            expect(data.totalGems).toBeGreaterThan(0);
        });

        it('should generate 5 guardians for difficulty 5', () => {
            const data = generateGuardianTributeData(5);
            expect(data.guardians).toHaveLength(5);
            expect(data.totalGems).toBeGreaterThan(0);
        });

        it('should have valid solutions that sum to total gems', () => {
            for (let difficulty = 1; difficulty <= 5; difficulty++) {
                const data = generateGuardianTributeData(difficulty);
                const sum = data.guardians.reduce((total, g) => total + g.solution, 0);
                expect(sum).toBe(data.totalGems);
            }
        });

        it('should generate solutions that satisfy all constraints', () => {
            for (let difficulty = 1; difficulty <= 5; difficulty++) {
                const data = generateGuardianTributeData(difficulty);
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
    });

    describe('validateGuardianConstraint', () => {
        it('should validate EXACT constraint correctly', () => {
            const constraint: GuardianConstraint = {
                type: GuardianConstraintType.EXACT,
                value: 10
            };
            expect(validateGuardianConstraint(10, constraint, [])).toBe(true);
            expect(validateGuardianConstraint(9, constraint, [])).toBe(false);
            expect(validateGuardianConstraint(11, constraint, [])).toBe(false);
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
            expect(validateGuardianConstraint(11, constraint, guardianValues)).toBe(false);
        });

        it('should validate ADDITION constraint correctly', () => {
            const constraint: GuardianConstraint = {
                type: GuardianConstraintType.ADDITION,
                value: 5,
                targetGuardian: 0
            };
            const guardianValues = [10, 15, 20];
            expect(validateGuardianConstraint(15, constraint, guardianValues)).toBe(true);
            expect(validateGuardianConstraint(14, constraint, guardianValues)).toBe(false);
            expect(validateGuardianConstraint(16, constraint, guardianValues)).toBe(false);
        });

        it('should validate RANGE constraint correctly', () => {
            const constraint: GuardianConstraint = {
                type: GuardianConstraintType.RANGE,
                min: 10,
                max: 20
            };
            expect(validateGuardianConstraint(10, constraint, [])).toBe(true);
            expect(validateGuardianConstraint(15, constraint, [])).toBe(true);
            expect(validateGuardianConstraint(20, constraint, [])).toBe(true);
            expect(validateGuardianConstraint(9, constraint, [])).toBe(false);
            expect(validateGuardianConstraint(21, constraint, [])).toBe(false);
        });

        it('should validate DIVISIBILITY constraint correctly', () => {
            const constraint: GuardianConstraint = {
                type: GuardianConstraintType.DIVISIBILITY,
                value: 5
            };
            expect(validateGuardianConstraint(5, constraint, [])).toBe(true);
            expect(validateGuardianConstraint(10, constraint, [])).toBe(true);
            expect(validateGuardianConstraint(15, constraint, [])).toBe(true);
            expect(validateGuardianConstraint(7, constraint, [])).toBe(false);
            expect(validateGuardianConstraint(0, constraint, [])).toBe(false); // 0 is not valid
        });

        it('should validate COMPARISON constraint correctly', () => {
            const greaterConstraint: GuardianConstraint = {
                type: GuardianConstraintType.COMPARISON,
                operator: 'greater',
                targetGuardian: 0
            };
            const lessConstraint: GuardianConstraint = {
                type: GuardianConstraintType.COMPARISON,
                operator: 'less',
                targetGuardian: 0
            };
            const guardianValues = [10, 15, 5];

            expect(validateGuardianConstraint(15, greaterConstraint, guardianValues)).toBe(true);
            expect(validateGuardianConstraint(10, greaterConstraint, guardianValues)).toBe(false);
            expect(validateGuardianConstraint(5, greaterConstraint, guardianValues)).toBe(false);

            expect(validateGuardianConstraint(5, lessConstraint, guardianValues)).toBe(true);
            expect(validateGuardianConstraint(10, lessConstraint, guardianValues)).toBe(false);
            expect(validateGuardianConstraint(15, lessConstraint, guardianValues)).toBe(false);
        });
    });

    describe('validateGuardianTributeSolution', () => {
        it('should validate a correct solution', () => {
            const data = generateGuardianTributeData(2);
            const solutions = data.guardians.map(g => g.solution);

            const result = validateGuardianTributeSolution(solutions, data);
            expect(result.isValid).toBe(true);
            expect(result.allConstraintsSatisfied).toBe(true);
            expect(result.allGemsDistributed).toBe(true);
        });

        it('should reject solution with wrong constraint values', () => {
            const data = generateGuardianTributeData(2);
            const wrongSolutions = [5, 10, 15]; // Arbitrary values that likely don't match constraints

            const result = validateGuardianTributeSolution(wrongSolutions, data);
            expect(result.isValid).toBe(false);
        });

        it('should reject solution with wrong total gems', () => {
            const data = generateGuardianTributeData(2);
            const solutions = data.guardians.map(g => g.solution);
            solutions[0] += 5; // Add extra gems to first guardian

            const result = validateGuardianTributeSolution(solutions, data);
            expect(result.isValid).toBe(false);
            expect(result.allGemsDistributed).toBe(false);
        });

        it('should reject solution with negative values', () => {
            const data = generateGuardianTributeData(2);
            const solutions = [-5, data.totalGems + 5, 0];

            const result = validateGuardianTributeSolution(solutions, data);
            expect(result.isValid).toBe(false);
        });

        it('should handle empty guardian values', () => {
            const data = generateGuardianTributeData(2);
            const emptySolutions = new Array(data.guardians.length).fill(0);

            const result = validateGuardianTributeSolution(emptySolutions, data);
            expect(result.isValid).toBe(false);
            expect(result.allGemsDistributed).toBe(false);
        });
    });
});
