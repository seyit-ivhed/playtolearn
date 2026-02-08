import { describe, it, expect } from 'vitest';
import { getRequiredXpForNextLevel, EXPERIENCE_CONFIG } from './experience.data';

describe('experience.data', () => {
    describe('getRequiredXpForNextLevel', () => {
        it('should return 0 if current level is equal to MAX_LEVEL', () => {
            const xp = getRequiredXpForNextLevel(EXPERIENCE_CONFIG.MAX_LEVEL);
            expect(xp).toBe(0);
        });

        it('should return 0 if current level is greater than MAX_LEVEL', () => {
            const xp = getRequiredXpForNextLevel(EXPERIENCE_CONFIG.MAX_LEVEL + 1);
            expect(xp).toBe(0);
        });

        it('should calculate XP correctly for level 1', () => {
            // Formula: floor(BASE * level ^ COEFFICIENT)
            // level 1: floor(80 * 1^1.05) = 80
            const xp = getRequiredXpForNextLevel(1);
            expect(xp).toBe(80);
        });

        it('should calculate XP correctly for level 2', () => {
            // level 2: floor(80 * 2^1.05) ~ 80 * 2.0705... = 165.6... -> 165
            const xp = getRequiredXpForNextLevel(2);
            // Let's rely on the function logic rather than pre-calculating loosely, 
            // but checking against a known value is good for regression.
            // 80 * 2^1.05 = 80 * 2.070529... = 165.64...
            expect(xp).toBe(165);
        });

        it('should increase monotonically', () => {
            const xp1 = getRequiredXpForNextLevel(1);
            const xp2 = getRequiredXpForNextLevel(2);
            const xp3 = getRequiredXpForNextLevel(3);

            expect(xp2).toBeGreaterThan(xp1);
            expect(xp3).toBeGreaterThan(xp2);
        });

        it('should handle floating point levels by treating them as is (though typically levels are ints)', () => {
            // The function doesn't explicitly restrict to integers, though in practice it is.
            // floor(80 * 1.5^1.05) = floor(80 * 1.53...) = 122
            const xp = getRequiredXpForNextLevel(1.5);
            expect(xp).toBeGreaterThan(80);
        });
    });
});
