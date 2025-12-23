import { describe, it, expect } from 'vitest';
import { generateSequenceData } from './sequence';
import { PuzzleType } from '../../../types/adventure.types';

describe('sequence puzzle generator', () => {
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

        // Lvl 5 might be ADD or MULTIPLY
        const lvl5 = generateSequenceData(5);
        expect(lvl5.rules![0]).toMatch(/(ADD|MULTIPLY)_\d+/);
    });

    it('should provide enough options for pattern establishment', () => {
        const data = generateSequenceData(3);
        // Solution length 8 + decoys 3 = 11 options
        expect(data.options.length).toBeGreaterThanOrEqual(10);
    });

    it('should ensure decoys are distinct from valid sequence members', () => {
        // This is tricky because we don't have the sequence exported.
        // But we can check for duplicates in the options array.
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
