import { describe, it, expect, beforeEach } from 'vitest';
import { usePartyStore } from './party.store';

describe('Party Store', () => {
    beforeEach(() => {
        usePartyStore.getState().resetParty();
    });

    it('should have initial state', () => {
        const state = usePartyStore.getState();
        expect(state.composition.slot_1).toBe('companion_fire_knight');
        expect(state.baseStats.health).toBe(100);
    });

    it('should add a companion', () => {
        usePartyStore.getState().addCompanion('slot_3', 'companion_shadow_archer');
        const state = usePartyStore.getState();
        expect(state.composition.slot_3).toBe('companion_shadow_archer');
    });

    it('should remove a companion', () => {
        usePartyStore.getState().addCompanion('slot_3', 'companion_shadow_archer');
        usePartyStore.getState().removeCompanion('slot_3');
        const state = usePartyStore.getState();
        expect(state.composition.slot_3).toBeNull();
    });

    it('should calculate total stats correctly', () => {
        // Initial stats: Health 100, Attack 0 (base) + 10 (Fire Knight) = 10
        let stats = usePartyStore.getState().getTotalStats();
        expect(stats.health).toBe(100);
        expect(stats.attack).toBe(10); // Base 0 + Fire Knight 10

        // Add Shadow Archer: Attack +12
        usePartyStore.getState().addCompanion('slot_3', 'companion_shadow_archer');
        stats = usePartyStore.getState().getTotalStats();
        expect(stats.attack).toBe(22); // 10 + 12

        // Add Nature Druid: Health +30, Speed -3
        usePartyStore.getState().addCompanion('slot_4', 'companion_nature_druid');
        stats = usePartyStore.getState().getTotalStats();
        expect(stats.health).toBe(130); // 100 + 30
        expect(stats.speed).toBe(7); // 10 - 3
    });
});
