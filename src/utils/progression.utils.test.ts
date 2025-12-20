import { describe, it, expect } from 'vitest';
import { getXpForNextLevel, calculateEncounterXp } from './progression.utils';

describe('progression.utils', () => {
    describe('getXpForNextLevel', () => {
        it('should return 15 XP for level 1', () => {
            expect(getXpForNextLevel(1)).toBe(15);
        });

        it('should return 35 XP for level 2', () => {
            expect(getXpForNextLevel(2)).toBe(35);
        });

        it('should return 59 XP for level 3', () => {
            expect(getXpForNextLevel(3)).toBe(59);
        });

        it('should return 233 XP for level 9', () => {
            expect(getXpForNextLevel(9)).toBe(233);
        });

        it('should increase XP requirement as level increases', () => {
            const xp1 = getXpForNextLevel(1);
            const xp2 = getXpForNextLevel(2);
            const xp3 = getXpForNextLevel(3);

            expect(xp2).toBeGreaterThan(xp1);
            expect(xp3).toBeGreaterThan(xp2);
        });
    });

    describe('calculateEncounterXp', () => {
        it('should calculate correct XP for first encounter', () => {
            expect(calculateEncounterXp('1', 1)).toBe(10);
        });

        it('should calculate correct XP for third encounter', () => {
            expect(calculateEncounterXp('1', 3)).toBe(30);
        });

        it('should calculate correct XP for second adventure first encounter', () => {
            expect(calculateEncounterXp('2', 1)).toBe(110);
        });
    });
});
