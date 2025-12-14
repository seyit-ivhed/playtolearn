import { describe, it, expect } from 'vitest';
import {
    generateProblem,
    validateAnswer,
    generateMultipleChoices
} from './math-generator';
import { MathOperation } from '../types/math.types';

describe('Math Generator', () => {
    describe('Addition', () => {
        it('should generate valid level 1 (Age 6) addition problems', () => {
            const problem = generateProblem(MathOperation.ADD, 1);

            expect(problem.difficulty).toBe(1);
            expect(problem.operand1).toBeGreaterThanOrEqual(0);
            expect(problem.operand1).toBeLessThanOrEqual(10);
            expect(problem.operand2).toBeGreaterThanOrEqual(0);
            expect(problem.operand2).toBeLessThanOrEqual(10);
            expect(problem.correctAnswer).toBe(problem.operand1 + problem.operand2);
        });

        it('should generate valid level 5 (Age 10) addition problems', () => {
            const problem = generateProblem(MathOperation.ADD, 5);

            expect(problem.difficulty).toBe(5);
            expect(problem.operand1).toBeGreaterThanOrEqual(100);
            expect(problem.operand1).toBeLessThanOrEqual(600);
            expect(problem.operand2).toBeGreaterThanOrEqual(100);
            expect(problem.operand2).toBeLessThanOrEqual(600);
        });
    });

    describe('Subtraction', () => {
        it('should generate valid level 1 subtraction problems with positive results', () => {
            const problem = generateProblem(MathOperation.SUBTRACT, 1);

            expect(problem.difficulty).toBe(1);
            expect(problem.operand1).toBeGreaterThanOrEqual(problem.operand2);
            expect(problem.correctAnswer).toBeGreaterThanOrEqual(0);
            expect(problem.correctAnswer).toBe(problem.operand1 - problem.operand2);
        });
    });

    describe('Multiplication', () => {
        it('should generate valid level 2 (Age 7) multiplication problems (0-4)', () => {
            const problem = generateProblem(MathOperation.MULTIPLY, 2);

            expect(problem.difficulty).toBe(2);
            expect(problem.operand1).toBeGreaterThanOrEqual(0);
            expect(problem.operand1).toBeLessThanOrEqual(4);
        });

        it('should generate valid level 3 (Age 8) multiplication problems', () => {
            const problem = generateProblem(MathOperation.MULTIPLY, 3);
            expect(problem.operand1).toBeGreaterThanOrEqual(1);
            expect(problem.operand1).toBeLessThanOrEqual(10);
        });
    });

    describe('Division', () => {
        it('should generate valid level 5 (Age 10) division problems with remainder', () => {
            const problem = generateProblem(MathOperation.DIVIDE, 5);

            expect(problem.difficulty).toBe(5);
            // Remainder problems return a string "Q R r"
            expect(typeof problem.correctAnswer).toBe('string');
            if (typeof problem.correctAnswer === 'string') {
                expect(problem.correctAnswer).toMatch(/^\d+\s*R\s*\d+$/);
                // And dividend is not perfectly divisible by divisor (unless remainder is 0, which we configured to avoid for now but math permits)
                // Actually our logic forces remainder >= 1
                expect(problem.operand1 % problem.operand2).not.toBe(0);
            }
        });
    });

    describe('Multiple Choice', () => {
        it('should generate 4 choices for numeric answers', () => {
            const choices = generateMultipleChoices(10);
            expect(choices).toHaveLength(4);
            expect(choices).toContain(10);
        });

        it('should generate 3 choices for string answers', () => {
            const choices = generateMultipleChoices("3 R 1", 3);
            expect(choices).toHaveLength(3);
            expect(choices).toContain("3 R 1");
        });

        it('should generate choices sorted numerically', () => {
            const choices = generateMultipleChoices(10);
            const sorted = [...choices].sort((a, b) => (a as number) - (b as number));
            expect(choices).toEqual(sorted);
        });
    });

    describe('Validation', () => {
        it('should correctly identify right answers', () => {
            const result = validateAnswer(5, 5);
            expect(result.isCorrect).toBe(true);
            expect(result.feedback).toBe('correct');
        });

        it('should correctly identify wrong answers', () => {
            const result = validateAnswer(3, 5);
            expect(result.isCorrect).toBe(false);
            expect(result.feedback).toBe('incorrect');
        });
    });
});
