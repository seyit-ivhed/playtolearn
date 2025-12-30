import { describe, it, expect } from 'vitest';
import {
    executeDamageAbility,
    executeHealAbility,
    executeShieldAbility,
    type HealableUnit,
    type ShieldableUnit
} from './ability.utils';
import type { SpecialAbility } from '../../types/companion.types';
import type { EncounterUnit } from '../../types/encounter.types';

const createMockUnit = (overrides: Partial<EncounterUnit> = {}): EncounterUnit => ({
    id: 'test-unit',
    templateId: 'test-template',
    name: 'Test Unit',
    isPlayer: false,
    maxHealth: 100,
    currentHealth: 100,
    maxShield: 0,
    currentShield: 0,
    isDead: false,
    hasActed: false,
    currentSpirit: 0,
    maxSpirit: 100,
    spiritGain: 10,
    statusEffects: [],
    ...overrides
});

describe('ability.utils', () => {
    describe('executeDamageAbility', () => {
        it('should damage all enemies when target is ALL_ENEMIES', () => {
            const enemies: EncounterUnit[] = [
                createMockUnit({ currentHealth: 100, currentShield: 0, isDead: false }),
                createMockUnit({ currentHealth: 80, currentShield: 0, isDead: false }),
                createMockUnit({ currentHealth: 60, currentShield: 0, isDead: false })
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'DAMAGE',
                value: 30,
                target: 'ALL_ENEMIES'
            };

            const result = executeDamageAbility(enemies, ability, 30);

            expect(result[0].currentHealth).toBe(70);
            expect(result[1].currentHealth).toBe(50);
            expect(result[2].currentHealth).toBe(30);
        });

        it('should damage single enemy when target is SINGLE_ENEMY', () => {
            const enemies: EncounterUnit[] = [
                createMockUnit({ currentHealth: 100, currentShield: 0, isDead: false }),
                createMockUnit({ currentHealth: 80, currentShield: 0, isDead: false })
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'DAMAGE',
                value: 30,
                target: 'SINGLE_ENEMY'
            };

            const result = executeDamageAbility(enemies, ability, 30);

            expect(result[0].currentHealth).toBe(70);
            expect(result[1].currentHealth).toBe(80); // Unchanged
        });

        it('should skip dead enemies when damaging all', () => {
            const enemies: EncounterUnit[] = [
                createMockUnit({ currentHealth: 0, currentShield: 0, isDead: true }),
                createMockUnit({ currentHealth: 80, currentShield: 0, isDead: false })
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'DAMAGE',
                value: 30,
                target: 'ALL_ENEMIES'
            };

            const result = executeDamageAbility(enemies, ability, 30);

            expect(result[0].currentHealth).toBe(0);
            expect(result[0].isDead).toBe(true);
            expect(result[1].currentHealth).toBe(50);
        });

        it('should target first living enemy when some are dead', () => {
            const enemies: EncounterUnit[] = [
                createMockUnit({ currentHealth: 0, currentShield: 0, isDead: true }),
                createMockUnit({ currentHealth: 80, currentShield: 0, isDead: false })
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'DAMAGE',
                value: 30,
                target: 'SINGLE_ENEMY'
            };

            const result = executeDamageAbility(enemies, ability, 30);

            expect(result[0].currentHealth).toBe(0); // Still dead
            expect(result[1].currentHealth).toBe(50); // Damaged
        });
    });

    describe('executeHealAbility', () => {
        it('should heal all allies when target is ALL_ALLIES', () => {
            const allies: HealableUnit[] = [
                { currentHealth: 50, maxHealth: 100, isDead: false },
                { currentHealth: 30, maxHealth: 80, isDead: false }
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'HEAL',
                value: 25,
                target: 'ALL_ALLIES'
            };

            const result = executeHealAbility(allies, ability, 25);

            expect(result[0].currentHealth).toBe(75);
            expect(result[1].currentHealth).toBe(55);
        });

        it('should not heal above max health', () => {
            const allies: HealableUnit[] = [
                { currentHealth: 90, maxHealth: 100, isDead: false }
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'HEAL',
                value: 25,
                target: 'ALL_ALLIES'
            };

            const result = executeHealAbility(allies, ability, 25);

            expect(result[0].currentHealth).toBe(100);
        });

        it('should heal lowest health ally when target is SINGLE_ALLY', () => {
            const allies: HealableUnit[] = [
                { currentHealth: 50, maxHealth: 100, isDead: false },
                { currentHealth: 20, maxHealth: 80, isDead: false },
                { currentHealth: 70, maxHealth: 100, isDead: false }
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'HEAL',
                value: 25,
                target: 'SINGLE_ALLY'
            };

            const result = executeHealAbility(allies, ability, 25);

            expect(result[0].currentHealth).toBe(50); // Unchanged
            expect(result[1].currentHealth).toBe(45); // Healed (lowest)
            expect(result[2].currentHealth).toBe(70); // Unchanged
        });

        it('should skip dead allies when healing all', () => {
            const allies: HealableUnit[] = [
                { currentHealth: 0, maxHealth: 100, isDead: true },
                { currentHealth: 50, maxHealth: 100, isDead: false }
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'HEAL',
                value: 25,
                target: 'ALL_ALLIES'
            };

            const result = executeHealAbility(allies, ability, 25);

            expect(result[0].currentHealth).toBe(0);
            expect(result[1].currentHealth).toBe(75);
        });
    });

    describe('executeShieldAbility', () => {
        it('should add shield to all allies when target is ALL_ALLIES', () => {
            const allies: ShieldableUnit[] = [
                { currentShield: 10, isDead: false },
                { currentShield: 0, isDead: false }
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'SHIELD',
                value: 20,
                target: 'ALL_ALLIES'
            };

            const result = executeShieldAbility(allies, ability, 20);

            expect(result[0].currentShield).toBe(30);
            expect(result[1].currentShield).toBe(20);
        });

        it('should skip dead allies when shielding', () => {
            const allies: ShieldableUnit[] = [
                { currentShield: 0, isDead: true },
                { currentShield: 10, isDead: false }
            ];

            const ability: SpecialAbility = {
                id: 'test',
                type: 'SHIELD',
                value: 20,
                target: 'ALL_ALLIES'
            };

            const result = executeShieldAbility(allies, ability, 20);

            expect(result[0].currentShield).toBe(0);
            expect(result[1].currentShield).toBe(30);
        });
    });
});
