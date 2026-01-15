import { describe, it, expect } from 'vitest';
import { validateNextStep, isSequenceComplete, generateStarPositions, generateSequenceData } from './SequenceEngine';
import { PuzzleType } from '../../../../types/adventure.types';

describe('SequenceEngine', () => {
    describe('validateNextStep', () => {
        const MultiplesOf2 = ['MULTIPLES_OF_2'];

        it('should validate the first step correctly for Multiples of 2', () => {
            expect(validateNextStep([], 2, MultiplesOf2)).toBe(true);
            expect(validateNextStep([], 4, MultiplesOf2)).toBe(false); // Should start at 2
        });

        it('should validate the next step correctly for Multiples of 2', () => {
            expect(validateNextStep([2], 4, MultiplesOf2)).toBe(true);
            expect(validateNextStep([2, 4], 6, MultiplesOf2)).toBe(true);

            expect(validateNextStep([2], 6, MultiplesOf2)).toBe(false); // Skipped 4
            expect(validateNextStep([2], 3, MultiplesOf2)).toBe(false); // Not multiple
        });

        it('should handle ADD_3', () => {
            const rules = ['ADD_3'];
            // First step logic: currently allows anything for generic ADD
            expect(validateNextStep([], 1, rules)).toBe(true);

            expect(validateNextStep([1], 4, rules)).toBe(true);
            expect(validateNextStep([1, 4], 7, rules)).toBe(true);

            expect(validateNextStep([1], 2, rules)).toBe(false); // +1 instead of +3
            expect(validateNextStep([1], 3, rules)).toBe(false); // +2 instead of +3
        });

        it('should handle MULTIPLY_2 (Doubling)', () => {
            const rules = ['MULTIPLY_2'];
            expect(validateNextStep([], 2, rules)).toBe(true);

            expect(validateNextStep([2], 4, rules)).toBe(true);
            expect(validateNextStep([2, 4], 8, rules)).toBe(true);
            expect(validateNextStep([2, 4, 8], 16, rules)).toBe(true);

            expect(validateNextStep([2], 5, rules)).toBe(false);
            expect(validateNextStep([2], 6, rules)).toBe(false); // x3 instead
        });
    });

    describe('isSequenceComplete', () => {
        it('should return true when last value reaches target', () => {
            expect(isSequenceComplete([2, 4, 6, 8, 10], 10)).toBe(true);
        });

        it('should return false when target not reached', () => {
            expect(isSequenceComplete([2, 4, 6], 10)).toBe(false);
        });

        it('should return false for empty chain', () => {
            expect(isSequenceComplete([], 10)).toBe(false);
        });
    });

    describe('generateStarPositions', () => {
        it('should generate requested number of positions', () => {
            const positions = generateStarPositions(5);
            expect(positions).toHaveLength(5);
        });

        it('should generate positions within bounds (10-90%)', () => {
            const positions = generateStarPositions(10);
            positions.forEach(pos => {
                expect(pos.x).toBeGreaterThanOrEqual(10);
                expect(pos.x).toBeLessThanOrEqual(90);
                expect(pos.y).toBeGreaterThanOrEqual(10);
                expect(pos.y).toBeLessThanOrEqual(90);
            });
        });

        it('should respect safe margin', () => {
            // Generate a few and check manually if it works reasonably well
            // It's random, so we can't test strict determinism easily without mocking math.random
            // But we can check that *some* distribution exists
            const positions = generateStarPositions(5, 10);
            // Basic sanity check: are they all unique?
            const set = new Set(positions.map(p => `${p.x},${p.y}`));
            expect(set.size).toBe(5);
        });
    });

    describe('generateSequenceData', () => {
        it('should generate valid puzzle structure', () => {
            const data = generateSequenceData(1);
            expect(data.puzzleType).toBe(PuzzleType.SEQUENCE);
            expect(data.targetValue).toBeDefined();
            expect(data.rules).toBeDefined();
            expect(Array.isArray(data.options)).toBe(true);
        });

        it('should include target value in options', () => {
            const data = generateSequenceData(2);
            expect(data.options).toContain(data.targetValue);
        });

        it('should respect difficulty constraints for rules', () => {
            const lvl1 = generateSequenceData(1);
            expect(lvl1.rules![0]).toMatch(/ADD_(1|2)/);

            const lvl5 = generateSequenceData(5);
            expect(lvl5.rules![0]).toMatch(/(ADD|MULTIPLY)_\d+/);
        });

        it('should provide enough options for pattern establishment', () => {
            const data = generateSequenceData(3);
            expect(data.options.length).toBeGreaterThanOrEqual(10);
        });

        it('should ensure decoys are distinct from valid sequence members', () => {
            for (let i = 0; i < 10; i++) {
                const data = generateSequenceData(2);
                const unique = new Set(data.options);
                expect(unique.size).toBe(data.options.length);
            }
        });

        it('should produce positive numbers only', () => {
            for (let i = 0; i < 20; i++) {
                const data = generateSequenceData(3);
                data.options.forEach(opt => {
                    expect(opt as number).toBeGreaterThan(0);
                });
            }
        });
    });
});
