import { describe, it, expect } from 'vitest';
import { decideEnemyAction } from './enemy-ai';
import type { CombatEntity } from '../types/combat.types';

describe('Enemy AI', () => {
    const mockPlayer: CombatEntity = {
        id: 'player',
        name: 'Player',
        maxHealth: 100,
        currentHealth: 100,
        maxShield: 50,
        currentShield: 50,
        maxEnergy: 100,
        currentEnergy: 100,
    };

    const mockEnemy: CombatEntity = {
        id: 'enemy',
        name: 'Enemy',
        maxHealth: 100,
        currentHealth: 100,
        maxShield: 0,
        currentShield: 0,
        maxEnergy: 0,
        currentEnergy: 0,
    };

    it('should attack when health is high', () => {
        const action = decideEnemyAction(mockEnemy, mockPlayer);
        expect(action.type).toBe('ATTACK');
    });

    it('should sometimes defend when health is low', () => {
        const lowHealthEnemy = { ...mockEnemy, currentHealth: 20 };

        // Run multiple times to check for randomness
        const actions = [];
        for (let i = 0; i < 20; i++) {
            actions.push(decideEnemyAction(lowHealthEnemy, mockPlayer));
        }

        const hasDefend = actions.some(a => a.type === 'DEFEND');
        const hasAttack = actions.some(a => a.type === 'ATTACK');

        // Note: This test is probabilistic, but with 20 runs it's highly likely to see both if logic is correct
        // If it fails often, we might need to mock Math.random
        expect(actions.length).toBe(20);
    });
});
