import { describe, it, expect } from 'vitest';
import {
    generateProblem,
    validateAnswer,
    generateMultipleChoices
} from './math-generator';
import { MathOperation } from '../types/math.types';

describe('Math Generator', () => {
    describe('Addition', () => {
        it('should generate valid level 1 addition problems', () => {
            const problem = generateProblem(MathOperation.ADD, 1);

            expect(problem.operation).toBe(MathOperation.ADD);
            expect(problem.difficulty).toBe(1);
            expect(problem.operand1).toBeGreaterThanOrEqual(1);
            expect(problem.operand1).toBeLessThanOrEqual(10);
            expect(problem.operand2).toBeGreaterThanOrEqual(1);
            expect(problem.operand2).toBeLessThanOrEqual(10);
            expect(problem.correctAnswer).toBe(problem.operand1 + problem.operand2);
        });

        it('should generate valid level 2 addition problems', () => {
            const problem = generateProblem(MathOperation.ADD, 2);

            expect(problem.difficulty).toBe(2);
            expect(problem.operand1).toBeGreaterThanOrEqual(10);
            expect(problem.operand1).toBeLessThanOrEqual(50);
            expect(problem.operand2).toBeGreaterThanOrEqual(10);
            expect(problem.operand2).toBeLessThanOrEqual(50);
            expect(problem.correctAnswer).toBe(problem.operand1 + problem.operand2);
        });
    });

    describe('Subtraction', () => {
        it('should generate valid level 1 subtraction problems with positive results', () => {
            // Run multiple times to ensure we never get negative results
            for (let i = 0; i < 20; i++) {
                const problem = generateProblem(MathOperation.SUBTRACT, 1);

                expect(problem.operation).toBe(MathOperation.SUBTRACT);
                expect(problem.correctAnswer).toBeGreaterThan(0);
                expect(problem.operand1).toBeGreaterThanOrEqual(problem.operand2);
                expect(problem.correctAnswer).toBe(problem.operand1 - problem.operand2);
            }
        });

        it('should generate valid level 2 subtraction problems', () => {
            const problem = generateProblem(MathOperation.SUBTRACT, 2);

            expect(problem.difficulty).toBe(2);
            expect(problem.correctAnswer).toBeGreaterThan(0);
            expect(problem.correctAnswer).toBe(problem.operand1 - problem.operand2);
        });
    });

    describe('Multiplication', () => {
        it('should generate valid level 1 multiplication problems', () => {
            const problem = generateProblem(MathOperation.MULTIPLY, 1);

            expect(problem.operation).toBe(MathOperation.MULTIPLY);
            expect(problem.operand1).toBeLessThanOrEqual(5);
            expect(problem.operand2).toBeLessThanOrEqual(5);
            expect(problem.correctAnswer).toBe(problem.operand1 * problem.operand2);
        });

        it('should generate valid level 2 multiplication problems', () => {
            const problem = generateProblem(MathOperation.MULTIPLY, 2);

            expect(problem.operand1).toBeLessThanOrEqual(10);
            expect(problem.operand2).toBeLessThanOrEqual(10);
            expect(problem.correctAnswer).toBe(problem.operand1 * problem.operand2);
        });
    });

    describe('Division', () => {
        it('should generate valid level 1 division problems with whole number results', () => {
            const problem = generateProblem(MathOperation.DIVIDE, 1);

            expect(problem.operation).toBe(MathOperation.DIVIDE);
            expect(problem.operand1 % problem.operand2).toBe(0); // No remainder
            expect(problem.correctAnswer).toBe(problem.operand1 / problem.operand2);
            expect(Number.isInteger(problem.correctAnswer)).toBe(true);
        });

        it('should generate valid level 2 division problems', () => {
            const problem = generateProblem(MathOperation.DIVIDE, 2);

            expect(problem.operand1 % problem.operand2).toBe(0);
            expect(Number.isInteger(problem.correctAnswer)).toBe(true);
        });
    });

    describe('Multiple Choice Generation', () => {
        it('should generate 4 choices including the correct answer', () => {
            const correctAnswer = 10;
            const choices = generateMultipleChoices(correctAnswer);

            expect(choices).toHaveLength(4);
            expect(choices).toContain(correctAnswer);

            // Check for uniqueness
            const uniqueChoices = new Set(choices);
            expect(uniqueChoices.size).toBe(4);
        });

        it('should generate choices sorted numerically', () => {
            const choices = generateMultipleChoices(10);
            const sorted = [...choices].sort((a, b) => a - b);
            expect(choices).toEqual(sorted);
        });
    });

    describe('Answer Validation', () => {
        it('should correctly identify right answers', () => {
            const result = validateAnswer(10, 10);
            expect(result.isCorrect).toBe(true);
            expect(result.feedback).toBe('correct');
        });

        it('should correctly identify wrong answers', () => {
            const result = validateAnswer(5, 10);
            expect(result.isCorrect).toBe(false);
            expect(result.feedback).toBe('incorrect');
        });
    });
});
