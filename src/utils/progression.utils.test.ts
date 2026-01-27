import { describe, it, expect } from 'vitest';
import { getStatsForLevel, calculateAdventureStars } from './progression.utils';
import type { Companion } from '../types/companion.types';
import { EncounterType, type Encounter } from '../types/adventure.types';
import type { EncounterResult } from '../stores/game/interfaces';

describe('progression.utils', () => {
    describe('getStatsForLevel', () => {
        const mockCompanion = {
            id: 'test',
            name: 'Test',
            baseStats: {
                maxHealth: 100,
                abilityDamage: 10
            },
            specialAbility: {
                id: 'test_ultimate',
                variables: { damage: 50 }
            },
            evolutions: []
        } as unknown as Companion;

        it('should return base stats at level 1', () => {
            const stats = getStatsForLevel(mockCompanion, 1);
            expect(stats.maxHealth).toBe(100);
            expect(stats.abilityDamage).toBe(10);
            expect(stats.specialAbilityVariables!.damage).toBe(50);
        });

        it('should scale stats linearly (10% per level)', () => {
            const stats = getStatsForLevel(mockCompanion, 2);
            // 1 + (2-1)*0.1 = 1.1
            expect(stats.maxHealth).toBe(110);
            expect(stats.abilityDamage).toBe(11);
            expect(stats.specialAbilityVariables!.damage).toBe(55);
        });

        it('should handle level 10 scaling', () => {
            const stats = getStatsForLevel(mockCompanion, 10);
            // 1 + (10-1)*0.1 = 1.9
            expect(stats.maxHealth).toBe(190);
            expect(stats.abilityDamage).toBe(19);
            expect(stats.specialAbilityVariables!.damage).toBe(95);
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



    describe('calculateAdventureStars', () => {
        const mockEncounters = [
            { id: '1', type: EncounterType.BATTLE },
            { id: '2', type: EncounterType.PUZZLE },
            { id: '3', type: EncounterType.BOSS }
        ] as unknown as Encounter[];

        it('should return 5 stars if all scorable encounters have 5 stars', () => {
            const results = {
                'adv1_1': { stars: 5 },
                'adv1_2': { stars: 5 },
                'adv1_3': { stars: 5 }
            } as unknown as Record<string, EncounterResult>;
            const result = calculateAdventureStars('adv1', mockEncounters, results);
            expect(result).toBe(5);
        });

        it('should return the minimum stars among scorable encounters', () => {
            const results = {
                'adv1_1': { stars: 5 },
                'adv1_2': { stars: 3 },
                'adv1_3': { stars: 5 }
            } as unknown as Record<string, EncounterResult>;
            const result = calculateAdventureStars('adv1', mockEncounters, results);
            expect(result).toBe(3);
        });

        it('should return 0 stars if a scorable encounter is missing from results (uncompleted)', () => {
            const results = {
                'adv1_1': { stars: 5 },
                'adv1_3': { stars: 5 }
                // adv1_2 is missing
            } as unknown as Record<string, EncounterResult>;
            const result = calculateAdventureStars('adv1', mockEncounters, results);
            expect(result).toBe(0);
        });
    });
});
