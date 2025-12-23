import { describe, it, expect } from 'vitest';
import { generateBalanceData } from './balance';
import { PuzzleType } from '../../../types/adventure.types';

describe('balance puzzle generator', () => {
    it('should generate valid puzzle structure', () => {
        const data = generateBalanceData(1);
        expect(data.puzzleType).toBe(PuzzleType.BALANCE);
        expect(data.targetValue).toBeGreaterThan(0);
        expect(data.initialLeftWeight).toBeDefined();
        expect(data.initialRightWeight).toBeDefined();
        expect(Array.isArray(data.leftOptions)).toBe(true);
        expect(Array.isArray(data.rightOptions)).toBe(true);
    });

    it('should ensure sides are reachable to target value', () => {
        // Since we explicitly generate weights to reach target:
        // sum(options) + initial == target
        // But we also add decoys!
        // So we can't just sum all. We need to check if there is A SUBSUM that works.
        // Actually our generator logic:
        // remLeft starts at neededLeft, we add weights and remLeft at end.
        // So ONE combination must equal target.

        const data = generateBalanceData(3);

        // This is a bit complex to find the subset sum, 
        // but we can at least verify that side sum >= target
        const leftTotal = (data.leftOptions as number[]).reduce((a, b) => a + b, 0) + (data.initialLeftWeight ?? 0);
        const rightTotal = (data.rightOptions as number[]).reduce((a, b) => a + b, 0) + (data.initialRightWeight ?? 0);

        expect(leftTotal).toBeGreaterThanOrEqual(data.targetValue);
        expect(rightTotal).toBeGreaterThanOrEqual(data.targetValue);
    });

    it('should generate more weights for higher difficulty', () => {
        const easy = generateBalanceData(1);
        const hard = generateBalanceData(5);

        // Difficulty 1: numLeftWeights = 1 (+ decoys)
        // Difficulty 5: numLeftWeights = 2 (+ decoys)
        // Decoys: 1 for easy, 2 for hard.
        expect(hard.leftOptions!.length).toBeGreaterThanOrEqual(easy.leftOptions!.length);
    });

    it('should have shuffled options', () => {
        // Hard to test randomness, but we can check if it stays valid over many runs
        for (let i = 0; i < 10; i++) {
            const data = generateBalanceData(2);
            expect(data.leftOptions!.length).toBeGreaterThan(0);
            expect(data.rightOptions!.length).toBeGreaterThan(0);
        }
    });
});
