import { describe, it, expect, vi } from 'vitest';
import { performWarriorAction } from './warrior.action';

describe('warrior.action', () => {
    const mockSet = vi.fn();
    const createMockGet = (monsters: any[]) => () => ({
        monsters,
        party: [],
    } as any);

    it('should deal damage to first living monster', () => {
        const monsters = [
            { id: 'm1', name: 'Monster 1', currentHealth: 50, isDead: false },
            { id: 'm2', name: 'Monster 2', currentHealth: 50, isDead: false }
        ];
        const get = createMockGet(monsters);
        const multiplier = 1.5;
        const companionData = { stats: { abilityDamage: 10 } }; // Base 10

        const log = performWarriorAction(get, mockSet, 0, companionData, multiplier);

        // Damage = 10 * 1.5 = 15
        expect(log).toBe(' Dealt 15 damage to Monster 1.');

        const newMonsters = mockSet.mock.lastCall![0].monsters;
        expect(newMonsters[0].currentHealth).toBe(35); // 50 - 15
        expect(newMonsters[1].currentHealth).toBe(50);
    });

    it('should use default base damage if stats missing', () => {
        const monsters = [{ id: 'm1', name: 'M1', currentHealth: 20 }];
        const get = createMockGet(monsters);
        const companionData = { stats: {} }; // No abilityDamage, defaults to 10

        const log = performWarriorAction(get, mockSet, 0, companionData, 2);

        // Damage = 10 * 2 = 20
        expect(log).toBe(' Dealt 20 damage to M1.');

        const newMonsters = mockSet.mock.lastCall![0].monsters;
        expect(newMonsters[0].currentHealth).toBe(0);
        expect(newMonsters[0].isDead).toBe(true);
    });

    it('should do nothing if all monsters dead', () => {
        const monsters = [{ id: 'm1', isDead: true }];
        const get = createMockGet(monsters);

        const log = performWarriorAction(get, mockSet, 0, { stats: {} }, 1);

        expect(log).toBe('');
    });
});
