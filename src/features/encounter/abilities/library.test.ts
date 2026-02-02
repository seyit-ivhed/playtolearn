import { describe, it, expect } from 'vitest';
import { ancestral_storm, jaguar_strike, elixir_of_life, blade_barrier } from './library';
import { type BattleUnit } from '../../../types/encounter.types';

describe('Ability Library', () => {
    const player1: BattleUnit = {
        id: 'player1',
        templateId: 'amara',
        name: 'Amara',
        isPlayer: true,
        currentHealth: 50,
        maxHealth: 100,
        isDead: false,
        maxSpirit: 100,
        currentSpirit: 100,
        spiritGain: 35,
        hasActed: false
    };

    const player2: BattleUnit = {
        id: 'player2',
        templateId: 'tariq',
        name: 'Tariq',
        isPlayer: true,
        currentHealth: 30,
        maxHealth: 80,
        isDead: false,
        maxSpirit: 100,
        currentSpirit: 100,
        spiritGain: 35,
        hasActed: false
    };

    const monster1: BattleUnit = {
        id: 'monster1',
        templateId: 'scout',
        name: 'Scout 1',
        isPlayer: false,
        currentHealth: 20,
        maxHealth: 20,
        isDead: false,
        maxSpirit: 0,
        currentSpirit: 0,
        spiritGain: 0,
        hasActed: false
    };

    const monster2: BattleUnit = {
        id: 'monster2',
        templateId: 'scout',
        name: 'Scout 2',
        isPlayer: false,
        currentHealth: 20,
        maxHealth: 20,
        isDead: false,
        maxSpirit: 0,
        currentSpirit: 0,
        spiritGain: 0,
        hasActed: false
    };

    describe('jaguar_strike', () => {
        it('should damage a single enemy', () => {
            const allUnits = [player1, monster1, monster2];
            const result = jaguar_strike({ attacker: player1, allUnits, variables: { damage: 10 } });

            const updatedMonster1 = result.updatedUnits.find(u => u.id === 'monster1');
            const updatedMonster2 = result.updatedUnits.find(u => u.id === 'monster2');

            expect(updatedMonster1?.currentHealth).toBe(10);
            expect(updatedMonster2?.currentHealth).toBe(20);
        });
    });

    describe('elixir_of_life', () => {
        it('should heal all living allies', () => {
            const allUnits = [player1, player2, monster1];
            const result = elixir_of_life({ attacker: player2, allUnits, variables: { heal: 20 } });

            const updatedPlayer1 = result.updatedUnits.find(u => u.id === 'player1');
            const updatedPlayer2 = result.updatedUnits.find(u => u.id === 'player2');

            expect(updatedPlayer1?.currentHealth).toBe(70);
            expect(updatedPlayer2?.currentHealth).toBe(50);
        });

        it('should not heal beyond max health', () => {
            const result = elixir_of_life({ attacker: player2, allUnits: [player1], variables: { heal: 100 } });
            const updatedPlayer1 = result.updatedUnits.find(u => u.id === 'player1');
            expect(updatedPlayer1?.currentHealth).toBe(100);
        });
    });

    describe('blade_barrier', () => {
        it('should damage an enemy and shield all allies', () => {
            const allUnits = [player1, player2, monster1];
            const result = blade_barrier({ attacker: player1, allUnits, variables: { damage: 10, duration: 2, reduction: 50 } });

            const updatedMonster1 = result.updatedUnits.find(u => u.id === 'monster1');
            const updatedPlayer1 = result.updatedUnits.find(u => u.id === 'player1');
            const updatedPlayer2 = result.updatedUnits.find(u => u.id === 'player2');

            expect(updatedMonster1?.currentHealth).toBe(10);
            expect(updatedPlayer1?.statusEffects).toContainEqual(expect.objectContaining({ type: 'SHIELD' }));
            expect(updatedPlayer2?.statusEffects).toContainEqual(expect.objectContaining({ type: 'SHIELD' }));
        });
    });

    describe('ancestral_storm', () => {
        it('should damage all enemies', () => {
            const allUnits = [player1, monster1, monster2];
            const result = ancestral_storm({ attacker: player1, allUnits, variables: { damage: 15 } });

            const updatedMonster1 = result.updatedUnits.find(u => u.id === 'monster1');
            const updatedMonster2 = result.updatedUnits.find(u => u.id === 'monster2');

            expect(updatedMonster1?.currentHealth).toBe(5);
            expect(updatedMonster2?.currentHealth).toBe(5);
        });

        it('should not damage dead enemies', () => {
            const deadMonster: BattleUnit = { ...monster1, id: 'dead1', isDead: true, currentHealth: 0 };
            const allUnits = [player1, deadMonster, monster2];
            const result = ancestral_storm({ attacker: player1, allUnits, variables: { damage: 15 } });

            const updatedDeadMonster = result.updatedUnits.find(u => u.id === 'dead1');
            const updatedMonster2 = result.updatedUnits.find(u => u.id === 'monster2');

            expect(updatedDeadMonster?.currentHealth).toBe(0);
            expect(updatedMonster2?.currentHealth).toBe(5);
        });
    });
});
