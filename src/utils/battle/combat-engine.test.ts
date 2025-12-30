
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
        isDead: false,
        statusEffects: []
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
        isDead: false,
        statusEffects: []
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

    describe('processTurnStart', () => {
        it('should decrement status effect duration', () => {
            const unit: BattleUnit = {
                ...mockAttacker,
                statusEffects: [{ id: 'poison', duration: 2 }]
            };
            const updated = CombatEngine.processTurnStart([unit]);
            expect(updated[0].statusEffects![0].duration).toBe(1);
        });

        it('should remove expired status effects', () => {
            const unit: BattleUnit = {
                ...mockAttacker,
                statusEffects: [{ id: 'stun', duration: 1 }]
            };
            const updated = CombatEngine.processTurnStart([unit]);
            expect(updated[0].statusEffects!.length).toBe(0);
        });
    });

    describe('consumeSpiritCost', () => {
        it('should reset spirit to 0', () => {
            const unit: BattleUnit = { ...mockAttacker, currentSpirit: 100 };
            const updated = CombatEngine.consumeSpiritCost(unit);
            expect(updated.currentSpirit).toBe(0);
        });
    });
});
