import { describe, it, expect } from 'vitest';
import {
    generateAdditionProblem,
    generateSubtractionProblem,
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
            // Level 2 Subtraction: left { min: 5, max: 20 }, right { min: 1, max: 10 }
            for (let i = 0; i < 50; i++) {
                const problem = generateSubtractionProblem(2);
                expect(problem.operand1).toBeGreaterThanOrEqual(5);
                expect(problem.operand1).toBeLessThanOrEqual(20);
                expect(problem.operand2).toBeGreaterThanOrEqual(1);
                expect(problem.operand2).toBeLessThanOrEqual(10);
                expect(problem.operand1).toBeGreaterThanOrEqual(problem.operand2);
            }
        });
    });

    describe('Operation Blocking', () => {
        it('should only allow addition and subtraction for Level 1', () => {
            const allowed = getAllowedOperations(1);
            expect(allowed).toContain(MathOperation.ADD);
            expect(allowed).toContain(MathOperation.SUBTRACT);
            expect(allowed).toHaveLength(2);
        });

        it('should allow all operations for Level 3', () => {
            const allowed = getAllowedOperations(3);
            expect(allowed).toContain(MathOperation.ADD);
            expect(allowed).toContain(MathOperation.SUBTRACT);
            expect(allowed).toContain(MathOperation.MULTIPLY);
            expect(allowed).toHaveLength(3);
        });
    });
});
