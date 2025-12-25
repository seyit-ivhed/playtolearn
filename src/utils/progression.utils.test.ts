import { describe, it, expect } from 'vitest';
import { getXpForNextLevel, getStatsForLevel } from './progression.utils';
import { CompanionRole, type Companion } from '../types/companion.types';

describe('progression.utils', () => {
    describe('getStatsForLevel', () => {
        const mockCompanion = {
            id: 'test',
            name: 'Test',
            role: CompanionRole.WARRIOR,
            baseStats: {
                maxHealth: 100,
                abilityDamage: 10
            },
            specialAbility: {
                id: 'test_ultimate',
                value: 50
            },
            evolutions: []
        } as unknown as Companion;

        it('should return base stats at level 1', () => {
            const stats = getStatsForLevel(mockCompanion, 1);
            expect(stats.maxHealth).toBe(100);
            expect(stats.abilityDamage).toBe(10);
            expect(stats.specialAbilityValue).toBe(50);
        });

        it('should scale stats linearly (10% per level)', () => {
            const stats = getStatsForLevel(mockCompanion, 2);
            // 1 + (2-1)*0.1 = 1.1
            expect(stats.maxHealth).toBe(110);
            expect(stats.abilityDamage).toBe(11);
            expect(stats.specialAbilityValue).toBe(55);
        });

        it('should handle level 10 scaling', () => {
            const stats = getStatsForLevel(mockCompanion, 10);
            // 1 + (10-1)*0.1 = 1.9
            expect(stats.maxHealth).toBe(190);
            expect(stats.abilityDamage).toBe(19);
            expect(stats.specialAbilityValue).toBe(95);
        });

        it('should apply evolution bonuses', () => {
            const companionWithEvo = {
                ...mockCompanion,
                evolutions: [
                    {
                        atLevel: 5,
                        title: 'Evolved',
                        statsBonus: {
                            maxHealth: 20,
                            abilityDamage: 5
                        }
                    }
                ]
            } as unknown as Companion;

            const statsLvl4 = getStatsForLevel(companionWithEvo, 4);
            const statsLvl5 = getStatsForLevel(companionWithEvo, 5);

            // Lvl 4: 1 + 0.3 = 1.3 -> 130 HP, 13 DMG
            expect(statsLvl4.maxHealth).toBe(130);
            expect(statsLvl4.abilityDamage).toBe(13);

            // Lvl 5: 1 + 0.4 = 1.4 -> 140 HP + 20 = 160 HP, 14 DMG + 5 = 19 DMG
            expect(statsLvl5.maxHealth).toBe(160);
            expect(statsLvl5.abilityDamage).toBe(19);
        });
    });

    describe('getXpForNextLevel', () => {
        it('should return 30 XP for level 1', () => {
            expect(getXpForNextLevel(1)).toBe(30);
        });

        it('should return 71 XP for level 2', () => {
            expect(getXpForNextLevel(2)).toBe(71);
        });

        it('should return 118 XP for level 3', () => {
            expect(getXpForNextLevel(3)).toBe(118);
        });

        it('should return 467 XP for level 9', () => {
            expect(getXpForNextLevel(9)).toBe(467);
        });

        it('should increase XP requirement as level increases', () => {
            const xp1 = getXpForNextLevel(1);
            const xp2 = getXpForNextLevel(2);
            const xp3 = getXpForNextLevel(3);

            expect(xp2).toBeGreaterThan(xp1);
            expect(xp3).toBeGreaterThan(xp2);
        });
    });

});
