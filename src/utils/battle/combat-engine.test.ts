import { describe, it, expect } from 'vitest';
import { CombatEngine, type BattleUnit } from './combat-engine';
import type { SpecialAbility } from '../../types/companion.types';

describe('CombatEngine', () => {
    const mockAttacker: BattleUnit = {
        id: 'p1',
        templateId: 'companion1',
        name: 'Hero',
        isPlayer: true,
        damage: 10,
        maxHealth: 100,
        currentHealth: 100,
        maxShield: 0,
        currentShield: 0,
        maxSpirit: 100,
        currentSpirit: 100,
        spiritGain: 10,
        hasActed: false,
        isDead: false
    };

    const mockEnemy: BattleUnit = {
        id: 'e1',
        templateId: 'monster1',
        name: 'Monster',
        isPlayer: false,
        damage: 5,
        maxHealth: 100,
        currentHealth: 100,
        maxShield: 0,
        currentShield: 0,
        maxSpirit: 100,
        currentSpirit: 0,
        spiritGain: 0,
        hasActed: false,
        isDead: false
    };

    describe('executeStandardAttack', () => {
        it('should deal damage to the first living target', () => {
            const result = CombatEngine.executeStandardAttack(mockAttacker, [mockEnemy]);
            const damagedEnemy = result.updatedTargets.find(u => u.id === mockEnemy.id);

            expect(damagedEnemy?.currentHealth).toBe(90);
            expect(result.logs.length).toBeGreaterThan(0);
        });

        it('should not deal damage if target is dead', () => {
            const deadEnemy: BattleUnit = { ...mockEnemy, isDead: true, currentHealth: 0 };
            const result = CombatEngine.executeStandardAttack(mockAttacker, [deadEnemy]);
            // No change expected
            expect(result.updatedTargets[0].currentHealth).toBe(0);
        });
    });

    describe('executeSpecialAbility', () => {
        it('should execute DAMAGE ability on single enemy', () => {
            const ability: SpecialAbility = {
                id: 'smash',
                type: 'DAMAGE',
                value: 20,
                target: 'SINGLE_ENEMY'
            };

            const result = CombatEngine.executeSpecialAbility(mockAttacker, [mockAttacker, mockEnemy], ability, 20);
            const damagedEnemy = result.updatedUnits.find(u => u.id === mockEnemy.id);

            expect(damagedEnemy?.currentHealth).toBe(80);
            expect(result.logs[0].type).toBe('ABILITY');
        });

        it('should execute HEAL ability on self/allies', () => {
            const damagedHero: BattleUnit = { ...mockAttacker, currentHealth: 50 };
            const ability: SpecialAbility = {
                id: 'heal',
                type: 'HEAL',
                value: 20,
                target: 'ALL_ALLIES'
            };

            const result = CombatEngine.executeSpecialAbility(mockAttacker, [damagedHero, mockEnemy], ability, 20);
            const healedHero = result.updatedUnits.find(u => u.id === mockAttacker.id);

            expect(healedHero?.currentHealth).toBe(70);
            expect(result.logs.find(l => l.type === 'EFFECT')).toBeTruthy();
        });

        it('should execute SHIELD ability', () => {
            const ability: SpecialAbility = {
                id: 'shield',
                type: 'SHIELD',
                value: 15,
                target: 'ALL_ALLIES'
            };

            const result = CombatEngine.executeSpecialAbility(mockAttacker, [mockAttacker, mockEnemy], ability, 15);
            const shieldedHero = result.updatedUnits.find(u => u.id === mockAttacker.id);

            expect(shieldedHero?.currentShield).toBe(15);
        });
    });

    describe('regenerateSpirit', () => {
        it('should increase spirit by gain amount', () => {
            const drainedHero: BattleUnit = { ...mockAttacker, currentSpirit: 50 };
            const updated = CombatEngine.regenerateSpirit([drainedHero]);

            expect(updated[0].currentSpirit).toBe(60);
        });

        it('should cap spirit at maxSpirit', () => {
            const updated = CombatEngine.regenerateSpirit([mockAttacker]);
            expect(updated[0].currentSpirit).toBe(100);
        });
    });
    describe('consumeSpiritCost', () => {
        it('should reset spirit to 0', () => {
            const unit = { ...mockAttacker, currentSpirit: 50 };
            const result = CombatEngine.consumeSpiritCost(unit);
            expect(result.currentSpirit).toBe(0);
        });
    });

    describe('selectRandomTarget', () => {
        it('should return valid index for living targets', () => {
            const targets = [
                { isDead: false },
                { isDead: false },
                { isDead: false }
            ];

            const index = CombatEngine.selectRandomTarget(targets);

            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(3);
            expect(targets[index].isDead).toBe(false);
        });

        it('should only select from living targets', () => {
            const targets = [
                { isDead: true },
                { isDead: false },
                { isDead: true }
            ];

            // Run multiple times to ensure consistency
            for (let i = 0; i < 10; i++) {
                const index = CombatEngine.selectRandomTarget(targets);
                expect(index).toBe(1);
            }
        });

        it('should return -1 when all targets are dead', () => {
            const targets = [
                { isDead: true },
                { isDead: true }
            ];

            const index = CombatEngine.selectRandomTarget(targets);

            expect(index).toBe(-1);
        });

        it('should return -1 for empty array', () => {
            const targets: { isDead: boolean }[] = [];

            const index = CombatEngine.selectRandomTarget(targets);

            expect(index).toBe(-1);
        });
    });

    describe('findFirstValidEnemy', () => {
        it('should find first living enemy', () => {
            const attacker = { id: 'u1', isPlayer: true, isDead: false };
            const targets = [
                { id: 'u1', isPlayer: true, isDead: false }, // Self
                { id: 'u2', isPlayer: true, isDead: false }, // Ally
                { id: 'm1', isPlayer: false, isDead: false }, // Enemy 1
                { id: 'm2', isPlayer: false, isDead: false }  // Enemy 2
            ];

            const index = CombatEngine.findFirstValidEnemy(attacker, targets);
            expect(index).toBe(2);
        });

        it('should skip dead enemies', () => {
            const attacker = { id: 'u1', isPlayer: true, isDead: false };
            const targets = [
                { id: 'm1', isPlayer: false, isDead: true }, // Dead Enemy
                { id: 'm2', isPlayer: false, isDead: false } // Living Enemy
            ];

            const index = CombatEngine.findFirstValidEnemy(attacker, targets);
            expect(index).toBe(1);
        });

        it('should return -1 if no valid targets', () => {
            const attacker = { id: 'u1', isPlayer: true, isDead: false };
            const targets = [
                { id: 'u1', isPlayer: true, isDead: false },
                { id: 'u2', isPlayer: true, isDead: false }
            ];

            const index = CombatEngine.findFirstValidEnemy(attacker, targets);
            expect(index).toBe(-1);
        });
    });


});
