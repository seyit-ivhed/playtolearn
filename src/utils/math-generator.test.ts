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
import { type GuardianTributePuzzleData } from '../features/encounter/puzzles/guardian-tribute/GuardianTributeEngine';
import { type SymmetryPuzzleData } from '../features/encounter/puzzles/symmetry/SymmetryEngine';
import { type LatinSquarePuzzleData } from '../features/encounter/puzzles/latin-square/LatinSquareEngine';

describe('Math Generator Functionality', () => {
    describe('Basic Math Problems', () => {
        it('should generate valid addition problems', () => {
            const problem = generateProblem(MathOperation.ADD, 1);
            expect(problem.operation).toBe(MathOperation.ADD);
            expect(problem.correctAnswer).toBe(problem.operand1 + problem.operand2);
            expect(problem.operand1).toBeLessThanOrEqual(10);
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
            expect(problem.operand2).toBeLessThanOrEqual(5); // x2 to x5 in level 3
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

        it('should generate valid Guardian Tribute puzzle data', () => {
            const data = generatePuzzleData(PuzzleType.GUARDIAN_TRIBUTE, 1) as GuardianTributePuzzleData;
            expect(data.puzzleType).toBe(PuzzleType.GUARDIAN_TRIBUTE);
            expect(data.guardians).toBeDefined();
            expect(data.guardians.length).toBeGreaterThan(0);
            expect(data.totalGems).toBeGreaterThan(0);
        });

        it('should generate valid Symmetry puzzle data', () => {
            const data = generatePuzzleData(PuzzleType.SYMMETRY, 1) as SymmetryPuzzleData;
            expect(data.puzzleType).toBe(PuzzleType.SYMMETRY);
            expect(data.targetValue).toBe(3); // Level 1 -> 3x3
            expect(data.leftOptions).toBeDefined();
            expect(data.rightOptions).toBeDefined();
        });

        it('should generate valid Latin Square puzzle data', () => {
            const data = generatePuzzleData(PuzzleType.LATIN_SQUARE, 2) as LatinSquarePuzzleData;
            expect(data.puzzleType).toBe(PuzzleType.LATIN_SQUARE);
            expect(data.targetValue).toBe(4);
            expect(data.options).toBeDefined();
        });
    });

    describe('Error Handling', () => {
        it('should throw error if puzzle type is missing', () => {
            // @ts-expect-error - Testing invalid input
            expect(() => generatePuzzleData(null, 1)).toThrow('Puzzle type is required');
        });

        it('should throw error if difficulty is missing', () => {
            // @ts-expect-error - Testing invalid input
            expect(() => generatePuzzleData(PuzzleType.SUM_TARGET, null)).toThrow('Valid difficulty level is required');
        });

        it('should throw error for unsupported puzzle type', () => {
            // @ts-expect-error - Testing invalid input
            expect(() => generatePuzzleData('INVALID_TYPE', 1)).toThrow('Unsupported puzzle type: INVALID_TYPE');
        });
    });
});
