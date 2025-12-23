import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeHealAbility } from './heal.ability';

describe('heal.ability', () => {
    const mockSet = vi.fn();
    const createMockGet = (party: any[]) => () => ({
        party,
        monsters: []
    } as any);

    beforeEach(() => {
        mockSet.mockClear();
    });

    it('should heal ALL_ALLIES up to maxHealth', () => {
        const party = [
            { id: 'p1', name: 'P1', currentHealth: 50, maxHealth: 100, isDead: false },
            { id: 'p2', name: 'P2', currentHealth: 80, maxHealth: 100, isDead: false },
            { id: 'p3', name: 'P3-Dead', currentHealth: 0, maxHealth: 100, isDead: true }
        ];
        const get = createMockGet(party);
        const ability = { id: 'heal', type: 'HEAL', target: 'ALL_ALLIES', value: 15 } as const;

        const logs = executeHealAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual(['Healed all allies for 15 HP!']);

        const newParty = mockSet.mock.lastCall![0].party;
        expect(newParty[0].currentHealth).toBe(65); // 50 + 15
        expect(newParty[1].currentHealth).toBe(95); // 80 + 15
        expect(newParty[2].currentHealth).toBe(0); // Dead ignored
    });

    it('should use scaled heal from party member (specialAbilityValue)', () => {
        const party = [
            { id: 'u1', name: 'U1', currentHealth: 40, maxHealth: 100, isDead: false, specialAbilityValue: 30 },
            { id: 'u2', name: 'U2', currentHealth: 30, maxHealth: 100, isDead: false }
        ];
        const get = () => ({ party } as any);
        const ability = { id: 'heal', type: 'HEAL', target: 'ALL_ALLIES', value: 15 } as const;

        const logs = executeHealAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual(['Healed all allies for 30 HP!']);
        const newParty = mockSet.mock.lastCall![0].party;
        expect(newParty[0].currentHealth).toBe(70); // 40 + 30
        expect(newParty[1].currentHealth).toBe(60); // 30 + 30
    });

    it('should not exceed maxHealth when healing', () => {
        const party = [
            { id: 'p1', name: 'P1', currentHealth: 95, maxHealth: 100, isDead: false }
        ];
        const get = createMockGet(party);
        const ability = { id: 'heal', type: 'HEAL' as const, target: 'ALL_ALLIES', value: 15 };

        executeHealAbility(get, mockSet, 'u1', ability);

        const newParty = mockSet.mock.lastCall![0].party;
        expect(newParty[0].currentHealth).toBe(100); // Capped at maxHealth
    });

    it('should heal SINGLE_ALLY with lowest health', () => {
        const party = [
            { id: 'p1', name: 'P1', currentHealth: 70, maxHealth: 100, isDead: false },
            { id: 'p2', name: 'P2', currentHealth: 30, maxHealth: 100, isDead: false },
            { id: 'p3', name: 'P3', currentHealth: 50, maxHealth: 100, isDead: false }
        ];
        const get = createMockGet(party);
        const ability = { id: 'heal', type: 'HEAL', target: 'SINGLE_ALLY', value: 20 } as const;

        executeHealAbility(get, mockSet, 'u1', ability);

        const newParty = mockSet.mock.lastCall![0].party;
        expect(newParty[0].currentHealth).toBe(70); // Unchanged
        expect(newParty[1].currentHealth).toBe(50); // 30 + 20
        expect(newParty[2].currentHealth).toBe(50); // Unchanged
    });

    it('should do nothing if target type is unknown', () => {
        const party = [{ id: 'p1', currentHealth: 50, maxHealth: 100 }];
        const get = createMockGet(party);
        const ability = { id: 'heal', type: 'HEAL' as const, target: 'UNKNOWN' as any, value: 10 };

        const logs = executeHealAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual([]);
    });
});
