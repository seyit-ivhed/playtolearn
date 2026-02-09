import { describe, it, expect } from 'vitest';
import { validateNextStep, isSequenceComplete, generateStarPositions, generateSequenceData } from './SequenceEngine';
import { PuzzleType } from '../../../../types/adventure.types';

describe('SequenceEngine', () => {
    describe('validateNextStep', () => {
        it('should handle ADD_3', () => {
            const rules = ['ADD_3'];
            expect(validateNextStep([], 1, rules)).toBe(true);
            expect(validateNextStep([1], 4, rules)).toBe(true);
            expect(validateNextStep([1, 4], 7, rules)).toBe(true);
            expect(validateNextStep([1], 2, rules)).toBe(false);
        });

        it('should handle MULTIPLY_2', () => {
            const rules = ['MULTIPLY_2'];
            expect(validateNextStep([], 2, rules)).toBe(true);
            expect(validateNextStep([2], 4, rules)).toBe(true);
            expect(validateNextStep([2, 4], 8, rules)).toBe(true);
            expect(validateNextStep([2], 5, rules)).toBe(false);
        });
    });

    describe('isSequenceComplete', () => {
        it('should return true when last value reaches target', () => {
            expect(isSequenceComplete([2, 4, 6, 8], 8)).toBe(true);
        });

        it('should return false when target not reached', () => {
            expect(isSequenceComplete([2, 4], 8)).toBe(false);
        });
    });

    describe('generateStarPositions', () => {
        it('should generate requested number of positions', () => {
            expect(generateStarPositions(5)).toHaveLength(5);
        });
    });

    describe('generateSequenceData', () => {
        it('should respect difficulty constraints for rules', () => {
            const lvl1 = generateSequenceData(1);
            expect(lvl1.rules![0]).toMatch(/ADD_\d+/);

            const lvl2 = generateSequenceData(2);
            expect(lvl2.rules![0]).toMatch(/ADD_\d+/);

            const lvl3 = generateSequenceData(3);
            expect(lvl3.rules![0]).toMatch(/MULTIPLY_\d+/);
        });

        it('should provide correct number of options', () => {
            expect(generateSequenceData(1).options).toHaveLength(8);
            expect(generateSequenceData(2).options).toHaveLength(12);
            expect(generateSequenceData(3).options).toHaveLength(6);
        });

        it('should produce valid sequence', () => {
            const data = generateSequenceData(1);
            expect(data.options).toContain(data.targetValue);
            expect(data.options[data.options.length - 1]).toBe(data.targetValue);
        });
    });
});

