import { describe, it, expect } from 'vitest';
import {
    generateAdditionProblem,
    generateSubtractionProblem,
    generateMultiplicationProblem,
    generateDivisionProblem,
    getAllowedOperations
} from './operations';
import { MathOperation } from '../../types/math.types';

describe('Math Operations Verification', () => {
    describe('Addition Range Control', () => {
        it('should respect left and right ranges for Level 2', () => {
            // Level 2 Addition: left { min: 5, max: 20 }, right { min: 1, max: 10 }
            for (let i = 0; i < 50; i++) {
                const problem = generateAdditionProblem(2);
                expect(problem.operand1).toBeGreaterThanOrEqual(5);
                expect(problem.operand1).toBeLessThanOrEqual(20);
                expect(problem.operand2).toBeGreaterThanOrEqual(1);
                expect(problem.operand2).toBeLessThanOrEqual(10);
            }
        });
    });

    describe('Subtraction Range Control', () => {
        it('should respect left and right ranges for Level 2', () => {
            // Level 2 Subtraction: left { min: 5, max: 10 }, right { min: 0, max: 3 }
            for (let i = 0; i < 50; i++) {
                const problem = generateSubtractionProblem(2);
                expect(problem.operand1).toBeGreaterThanOrEqual(5);
                expect(problem.operand1).toBeLessThanOrEqual(10);
                expect(problem.operand2).toBeGreaterThanOrEqual(0);
                expect(problem.operand2).toBeLessThanOrEqual(3);
                expect(problem.operand1).toBeGreaterThanOrEqual(problem.operand2);
            }
        });
    });

    describe('Division Range Control', () => {
        it('should respect left (dividend) and right (divisor) ranges for Level 4', () => {
            // Level 4 Division: left { min: 10, max: 50 }, right { min: 2, max: 10 }, forceRemainder: false
            for (let i = 0; i < 50; i++) {
                const problem = generateDivisionProblem(4);
                expect(problem.operand1).toBeGreaterThanOrEqual(10);
                expect(problem.operand1).toBeLessThanOrEqual(50);
                expect(problem.operand2).toBeGreaterThanOrEqual(2);
                expect(problem.operand2).toBeLessThanOrEqual(10);
                expect(Number(problem.operand1) % Number(problem.operand2)).toBe(0);
            }
        });

        it('should ALWAYS generate remainders for Level 5', () => {
            // Level 5 Division: forceRemainder: true
            for (let i = 0; i < 100; i++) {
                const problem = generateDivisionProblem(5);
                expect(typeof problem.correctAnswer).toBe('string');
                // Regex matches "X R Y" where Y > 0
                expect(problem.correctAnswer as string).toMatch(/^\d+ R [1-9]\d*$/);
            }
        });
    });

    describe('Operation Blocking', () => {
        it('should only allow addition for Level 1', () => {
            const allowed = getAllowedOperations(1);
            expect(allowed).toEqual([MathOperation.ADD]);
        });

        it('should only allow addition and subtraction for Level 2', () => {
            const allowed = getAllowedOperations(2);
            expect(allowed).toContain(MathOperation.ADD);
            expect(allowed).toContain(MathOperation.SUBTRACT);
            expect(allowed).not.toContain(MathOperation.MULTIPLY);
            expect(allowed).not.toContain(MathOperation.DIVIDE);
            expect(allowed).toHaveLength(2);
        });
    });
});
