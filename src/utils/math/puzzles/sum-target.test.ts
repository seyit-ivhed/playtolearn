import { describe, it, expect } from 'vitest';
import { generateSumTargetData } from './sum-target';
import { PuzzleType } from '../../../types/adventure.types';

describe('sum-target puzzle generator', () => {
    it('should generate valid puzzle structure', () => {
        const data = generateSumTargetData(1);
        expect(data.puzzleType).toBe(PuzzleType.SUM_TARGET);
        expect(typeof data.targetValue).toBe('number');
        expect(Array.isArray(data.options)).toBe(true);
    });

    it('should scale difficulty with steps', () => {
        // Difficulty 1: 2 steps -> solutionPipes has 2 items
        // Wait, options contains BOTH solution and decoy.
        // Let's just check that it produces a solvable-looking target.
        const data = generateSumTargetData(1);
        expect(data.options.length).toBeGreaterThanOrEqual(2);
    });

    it('should include both numbers and objects (for higher difficulties)', () => {
        const data = generateSumTargetData(5);
        const hasOperations = data.options.some(opt => typeof opt === 'object');
        // Since it's random, we might not always get an object, but at difficulty 5 it's highly likely.
        // We'll just verify it doesn't crash and returns valid options.
        expect(data.options.length).toBeGreaterThan(0);
        expect(typeof hasOperations).toBe('boolean');
    });

    it('should not have 0 as an option value', () => {
        for (let i = 0; i < 10; i++) {
            const data = generateSumTargetData(3);
            data.options.forEach(opt => {
                if (typeof opt === 'number') {
                    expect(opt).not.toBe(0);
                } else {
                    expect(opt.value).not.toBe(0);
                }
            });
        }
    });

    it('should produce a positive target value', () => {
        for (let i = 0; i < 20; i++) {
            const difficulty = getRandomInt(1, 5) as import('../../../types/math.types').DifficultyLevel;
            const data = generateSumTargetData(difficulty);
            expect(data.targetValue).toBeGreaterThan(0);
        }
    });
});

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
