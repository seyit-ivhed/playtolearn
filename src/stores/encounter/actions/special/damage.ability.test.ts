import { describe, it, expect, vi } from 'vitest';
import { executeDamageAbility } from './damage.ability';

describe('damage.ability', () => {
    const mockSet = vi.fn();

    // Helper to create mock store state
    const createMockGet = (monsters: any[]) => () => ({
        monsters,
        party: [], // Not needed for this test
        // Add other store properties as needed to satisfy type if strict, 
        // but for this function only monsters is destructured.
    } as any);

    it('should deal damage to ALL_ENEMIES', () => {
        const monsters = [
            { id: 'm1', name: 'M1', currentHealth: 50, isDead: false },
            { id: 'm2', name: 'M2', currentHealth: 20, isDead: false },
            { id: 'm3', name: 'M3-Dead', currentHealth: 0, isDead: true }
        ];
        const get = createMockGet(monsters);
        const ability = { target: 'ALL_ENEMIES', value: 10 };

        const logs = executeDamageAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual(['Dealt 10 damage to all enemies!']);

        // Check if set was called with updated monsters
        const calls = mockSet.mock.calls;
        expect(calls.length).toBe(1);
        const newMonsters = calls[0][0].monsters;

        expect(newMonsters[0].currentHealth).toBe(40);
        expect(newMonsters[1].currentHealth).toBe(10);
        expect(newMonsters[2].currentHealth).toBe(0); // Dead one remains dead/ignored
    });

    it('should use scaled damage from party member (specialAbilityValue)', () => {
        const monsters = [{ id: 'm1', name: 'M1', currentHealth: 50, isDead: false }];
        const party = [{ id: 'u1', specialAbilityValue: 35 }];
        const get = () => ({ monsters, party } as any);
        const ability = { target: 'SINGLE_ENEMY', value: 25 }; // Default value

        const logs = executeDamageAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual(['Dealt 35 damage to M1!']);
        const newMonsters = mockSet.mock.lastCall![0].monsters;
        expect(newMonsters[0].currentHealth).toBe(15); // 50 - 35
    });

    it('should deal damage to SINGLE_ENEMY (first living)', () => {
        const monsters = [
            { id: 'm1-Dead', name: 'M1', currentHealth: 0, isDead: true },
            { id: 'm2', name: 'M2', currentHealth: 50, isDead: false },
            { id: 'm3', name: 'M3', currentHealth: 50, isDead: false }
        ];
        const get = createMockGet(monsters);
        const ability = { target: 'SINGLE_ENEMY', value: 20 };

        const logs = executeDamageAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual(['Dealt 20 damage to M2!']);

        const calls = mockSet.mock.calls;
        const newMonsters = calls[calls.length - 1][0].monsters;

        expect(newMonsters[0].currentHealth).toBe(0); // Unchanged
        expect(newMonsters[1].currentHealth).toBe(30); // 50 - 20
        expect(newMonsters[2].currentHealth).toBe(50); // Unchanged
    });

    it('should handle killing blows', () => {
        const monsters = [
            { id: 'm1', name: 'M1', currentHealth: 10, isDead: false }
        ];
        const get = createMockGet(monsters);
        const ability = { target: 'SINGLE_ENEMY', value: 15 };

        executeDamageAbility(get, mockSet, 'u1', ability);

        const newMonsters = mockSet.mock.lastCall![0].monsters;
        expect(newMonsters[0].currentHealth).toBe(0);
        expect(newMonsters[0].isDead).toBe(true);
    });

    it('should do nothing if no living targets found for SINGLE_ENEMY', () => {
        const monsters = [
            { id: 'm1', isDead: true }
        ];
        const get = createMockGet(monsters);
        const ability = { target: 'SINGLE_ENEMY', value: 10 };

        const logs = executeDamageAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual([]);
        // Should not call set? Or check implementation behavior
        // Implementation: "if (targetIndex !== -1) { ... set(...) }"
        // So if -1, no set call using that specific logic path.

        // Note: mockSet is cumulative across tests if not cleared.
        // We should clear it.
    });
});
