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
            expect(problem.operand1).toBeGreaterThanOrEqual(10);
            expect(problem.operand1).toBeLessThanOrEqual(200);
            expect(problem.operand2).toBeGreaterThanOrEqual(10);
            expect(problem.operand2).toBeLessThanOrEqual(200);
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
        it('should generate valid level 5 (Age 10) division problems', () => {
            const problem = generateProblem(MathOperation.DIVIDE, 5);

            expect(problem.difficulty).toBe(5);
            expect(problem.operand1 % problem.operand2).toBe(0); // No remainder
            expect(problem.correctAnswer).toBe(problem.operand1 / problem.operand2);
        });
    });

    describe('Multiple Choice', () => {
        it('should generate 4 choices including the correct answer', () => {
            const choices = generateMultipleChoices(10);
            expect(choices).toHaveLength(4);
            expect(choices).toContain(10);
        });

        it('should generate choices sorted numerically', () => {
            const choices = generateMultipleChoices(10);
            const sorted = [...choices].sort((a, b) => a - b);
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
