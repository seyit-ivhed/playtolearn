import { describe, it, expect, vi } from 'vitest';
import {
    validateNextStep,
    isSequenceComplete,
    generateStarPositions,
    generateSequenceData,
    AdditionRule,
    SequenceRuleFactory
} from './SequenceEngine';

describe('SequenceEngine', () => {
    describe('validateNextStep', () => {
        it('should handle ADD_3', () => {
            const rules = ['ADD_3'];
            expect(validateNextStep([], 1, rules)).toBe(true);
            expect(validateNextStep([1], 4, rules)).toBe(true);
            expect(validateNextStep([1, 4], 7, rules)).toBe(true);
            expect(validateNextStep([1], 2, rules)).toBe(false);
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
            expect(lvl1.rules![0]).toBe('ADD_1');
            expect(lvl1.options[0]).toBe(1);

            const lvl2 = generateSequenceData(2);
            expect(lvl2.rules![0]).toMatch(/ADD_[23]/);

            const lvl3 = generateSequenceData(3);
            expect(lvl3.rules![0]).toMatch(/ADD_[456]/);
        });

        it('should provide correct number of options', () => {
            expect(generateSequenceData(1).options).toHaveLength(10);
            expect(generateSequenceData(2).options).toHaveLength(8);
            expect(generateSequenceData(3).options).toHaveLength(6);
        });

        it('should produce valid sequence', () => {
            const data = generateSequenceData(1);
            expect(data.options).toContain(data.targetValue);
            expect(data.options[data.options.length - 1]).toBe(data.targetValue);
        });
    });

    describe('Edge Cases and Validation', () => {
        it('AdditionRule should handle invalid step', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
            // @ts-expect-error: Testing invalid input
            const rule = new AdditionRule('invalid');
            expect(rule.step).toBe(0);
            expect(new AdditionRule(NaN).step).toBe(0);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('SequenceRuleFactory should handle invalid rule names', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
            // @ts-expect-error: Testing invalid input
            expect(SequenceRuleFactory.getRule(null)).toBeNull();
            expect(SequenceRuleFactory.getRule('INVALID_RULE')).toBeNull();
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('validateNextStep should return false for invalid inputs', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
            // @ts-expect-error: Testing invalid input
            expect(validateNextStep(null, 1, ['ADD_1'])).toBe(false);
            // @ts-expect-error: Testing invalid input
            expect(validateNextStep([1], 2, null)).toBe(false);
            expect(validateNextStep([1], 2, [])).toBe(false);
            expect(validateNextStep([1], 2, ['INVALID_RULE'])).toBe(false);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('isSequenceComplete should return false for invalid inputs', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
            // @ts-expect-error: Testing invalid input
            expect(isSequenceComplete(null, 10)).toBe(false);
            expect(isSequenceComplete([], 10)).toBe(false);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('generateStarPositions should handle invalid inputs', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
            // @ts-expect-error: Testing invalid input
            expect(generateStarPositions('invalid')).toEqual([]);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('generateSequenceData should handle invalid inputs', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
            // @ts-expect-error: Testing invalid input
            const data = generateSequenceData('invalid');
            expect(data.targetValue).toBe(0);
            expect(data.options).toEqual([]);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});
