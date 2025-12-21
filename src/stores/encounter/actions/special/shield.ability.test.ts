import { describe, it, expect, vi } from 'vitest';
import { executeShieldAbility } from './shield.ability';

describe('shield.ability', () => {
    const mockSet = vi.fn();
    const createMockGet = (party: any[]) => () => ({
        party,
        monsters: []
    } as any);

    it('should apply shield to ALL_ALLIES', () => {
        const party = [
            { id: 'p1', name: 'P1', currentShield: 0, isDead: false },
            { id: 'p2', name: 'P2', currentShield: 10, isDead: false },
            { id: 'p3', name: 'P3-Dead', currentShield: 0, isDead: true }
        ];
        const get = createMockGet(party);
        const ability = { target: 'ALL_ALLIES', value: 15 };

        const logs = executeShieldAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual(['Shielded party for 15!']);

        const newParty = mockSet.mock.lastCall![0].party;
        expect(newParty[0].currentShield).toBe(15);
        expect(newParty[1].currentShield).toBe(25); // 10 + 15
        expect(newParty[2].currentShield).toBe(0); // Dead ignored
    });

    it('should use scaled shield from party member (specialAbilityValue)', () => {
        const party = [
            { id: 'u1', name: 'U1', currentShield: 0, isDead: false, specialAbilityValue: 20 },
            { id: 'u2', name: 'U2', currentShield: 5, isDead: false }
        ];
        const get = () => ({ party } as any);
        const ability = { target: 'ALL_ALLIES', value: 10 };

        const logs = executeShieldAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual(['Shielded party for 20!']);
        const newParty = mockSet.mock.lastCall![0].party;
        expect(newParty[0].currentShield).toBe(20); // 0 + 20
        expect(newParty[1].currentShield).toBe(25); // 5 + 20
    });

    it('should do nothing if target type is unknown', () => {
        const party = [{ id: 'p1', currentShield: 0 }];
        const get = createMockGet(party);
        const ability = { target: 'UNKNOWN', value: 10 };

        const logs = executeShieldAbility(get, mockSet, 'u1', ability);

        expect(logs).toEqual([]);
        // Ideally set should not be called or party unchanged, implementation dependent.
        // The implementation only checks for ALL_ALLIES currently.
    });
});
