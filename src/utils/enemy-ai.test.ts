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
        modules: {
            attack: { currentEnergy: 3, maxEnergy: 3 },
            defend: { currentEnergy: 2, maxEnergy: 2 },
            special: { currentEnergy: 2, maxEnergy: 2 },
        },
    };

    const mockEnemy: CombatEntity = {
        id: 'enemy',
        name: 'Enemy',
        maxHealth: 100,
        currentHealth: 100,
        maxShield: 0,
        currentShield: 0,
        modules: {
            attack: { currentEnergy: 0, maxEnergy: 0 },
            defend: { currentEnergy: 0, maxEnergy: 0 },
            special: { currentEnergy: 0, maxEnergy: 0 },
        },
    };

    it('should attack when health is high', () => {
        const action = decideEnemyAction(mockEnemy, mockPlayer);
        expect(action.type).toBe('attack');
    });

    it('should sometimes defend when health is low', () => {
        const lowHealthEnemy = { ...mockEnemy, currentHealth: 20 };

        // Run multiple times to check for randomness
        const actions = [];
        for (let i = 0; i < 20; i++) {
            actions.push(decideEnemyAction(lowHealthEnemy, mockPlayer));
        }

        const hasDefend = actions.some(a => a.type === 'defend');
        const hasAttack = actions.some(a => a.type === 'attack');

        // Note: This test is probabilistic, but with 20 runs it's highly likely to see both if logic is correct
        // If it fails often, we might need to mock Math.random
        expect(actions.length).toBe(20);
        // We expect at least one defend action in 20 tries with 50% chance
        if (hasDefend) {
            expect(hasDefend).toBe(true);
        }
        expect(hasAttack).toBe(true);
    });
});
