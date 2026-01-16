import { describe, it, expect } from 'vitest';
import {
    generateProblem,
    validateAnswer,
    generateMultipleChoices,
    generatePuzzleData
} from './math-generator';
import { MathOperation } from '../types/math.types';
import { PuzzleType } from '../types/adventure.types';
import { type BalancePuzzleData } from '../features/encounter/puzzles/balance/BalanceEngine';

describe('Math Generator Functionality', () => {
    describe('Basic Math Problems', () => {
        it('should generate valid addition problems', () => {
            const problem = generateProblem(MathOperation.ADD, 1);
            expect(problem.operation).toBe(MathOperation.ADD);
            expect(problem.correctAnswer).toBe(problem.operand1 + problem.operand2);
        });

        it('should generate valid subtraction problems with non-negative results', () => {
            const problem = generateProblem(MathOperation.SUBTRACT, 1);
            expect(problem.operation).toBe(MathOperation.SUBTRACT);
            expect(problem.operand1).toBeGreaterThanOrEqual(problem.operand2);
            expect(problem.correctAnswer).toBe(problem.operand1 - problem.operand2);
        });

        it('should generate valid multiplication problems', () => {
            const problem = generateProblem(MathOperation.MULTIPLY, 3);
            expect(problem.operation).toBe(MathOperation.MULTIPLY);
            expect(problem.correctAnswer).toBe(problem.operand1 * problem.operand2);
        });

        it('should generate valid division problems (whole number)', () => {
            const problem = generateProblem(MathOperation.DIVIDE, 4);
            expect(problem.operation).toBe(MathOperation.DIVIDE);
            expect(typeof problem.correctAnswer).toBe('number');
            expect(problem.operand1 / problem.operand2).toBe(problem.correctAnswer);
        });

        it('should generate valid division problems with remainders at higher difficulty', () => {
            const problem = generateProblem(MathOperation.DIVIDE, 5);
            expect(problem.operation).toBe(MathOperation.DIVIDE);
            expect(typeof problem.correctAnswer).toBe('string');
            expect(problem.correctAnswer).toMatch(/\d+ R \d+/);
        });
    });

    describe('Answer Validation', () => {
        it('should validate correct numeric answers', () => {
            const result = validateAnswer(10, 10);
            expect(result.isCorrect).toBe(true);
        });

        it('should validate incorrect numeric answers', () => {
            const result = validateAnswer(9, 10);
            expect(result.isCorrect).toBe(false);
        });

        it('should validate correct string answers (remainders)', () => {
            const result = validateAnswer('5 R 2', '5 R 2');
            expect(result.isCorrect).toBe(true);
        });

        it('should validate incorrect string answers', () => {
            const result = validateAnswer('5 R 1', '5 R 2');
            expect(result.isCorrect).toBe(false);
        });
    });

    describe('Multiple Choice Generation', () => {
        it('should include the correct answer in choices', () => {
            const answer = 42;
            const choices = generateMultipleChoices(answer);
            expect(choices).toContain(answer);
        });

        it('should generate unique choices', () => {
            const choices = generateMultipleChoices(10);
            const uniqueChoices = new Set(choices);
            expect(uniqueChoices.size).toBe(choices.length);
        });

        it('should generate correct number of choices', () => {
            expect(generateMultipleChoices(5, 4)).toHaveLength(4);
            expect(generateMultipleChoices(5, 3)).toHaveLength(3);
        });
    });

    describe('Puzzle Data Generation', () => {
        it('should generate valid Sum Target puzzle data', () => {
            const data = generatePuzzleData(PuzzleType.SUM_TARGET, 3);
            expect(data.puzzleType).toBe(PuzzleType.SUM_TARGET);
            expect(data.targetValue).toBeGreaterThan(0);
            expect(data.options.length).toBeGreaterThan(0);
        });

        it('should generate valid Balance puzzle data', () => {
            const data = generatePuzzleData(PuzzleType.BALANCE, 2) as BalancePuzzleData;
            expect(data.puzzleType).toBe(PuzzleType.BALANCE);
            expect(data.leftStack).toBeDefined();
            expect(data.rightStack).toBeDefined();
            expect(data.leftStack.length).toBeGreaterThan(0);
            expect(data.rightStack.length).toBeGreaterThan(0);
        });

        it('should generate valid Sequence puzzle data', () => {
            const data = generatePuzzleData(PuzzleType.SEQUENCE, 1);
            expect(data.puzzleType).toBe(PuzzleType.SEQUENCE);
            expect(data.targetValue).toBeDefined();
            expect(data.rules).toBeDefined();
            expect(data.options.length).toBeGreaterThan(0);
        });
    });
});
