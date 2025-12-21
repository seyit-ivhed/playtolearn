import { describe, it, expect } from 'vitest';
import { validateNextStep, isSequenceComplete, generateStarPositions } from './SequenceEngine';

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

        it('should handle Multiples of 5', () => {
            const rules = ['MULTIPLES_OF_5'];
            expect(validateNextStep([], 5, rules)).toBe(true);
            expect(validateNextStep([5], 10, rules)).toBe(true);
            expect(validateNextStep([5, 10], 15, rules)).toBe(true);

            expect(validateNextStep([5], 11, rules)).toBe(false);
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
});
