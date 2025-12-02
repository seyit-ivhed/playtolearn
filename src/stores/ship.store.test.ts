import { describe, it, expect, beforeEach } from 'vitest';
import { useShipStore } from './ship.store';

describe('Ship Store', () => {
    beforeEach(() => {
        useShipStore.getState().resetShip();
    });

    it('should have initial state', () => {
        const state = useShipStore.getState();
        expect(state.loadout.slot_weapon_1).toBe('weapon_laser_1');
        expect(state.baseStats.health).toBe(100);
    });

    it('should equip a module', () => {
        useShipStore.getState().equipModule('slot_weapon_2', 'weapon_missile_1');
        const state = useShipStore.getState();
        expect(state.loadout.slot_weapon_2).toBe('weapon_missile_1');
    });

    it('should unequip a module', () => {
        useShipStore.getState().equipModule('slot_weapon_2', 'weapon_missile_1');
        useShipStore.getState().unequipModule('slot_weapon_2');
        const state = useShipStore.getState();
        expect(state.loadout.slot_weapon_2).toBeNull();
    });

    it('should calculate total stats correctly', () => {
        // Initial stats: Health 100, Attack 0 (base) + 10 (laser) = 10
        let stats = useShipStore.getState().getTotalStats();
        expect(stats.health).toBe(100);
        expect(stats.attack).toBe(10); // Base 0 + Laser 10

        // Equip Missile Launcher: Attack +25
        useShipStore.getState().equipModule('slot_weapon_2', 'weapon_missile_1');
        stats = useShipStore.getState().getTotalStats();
        expect(stats.attack).toBe(35); // 10 + 25

        // Equip Reinforced Armor: Health +50, Speed -5
        useShipStore.getState().equipModule('slot_special_1', 'armor_reinforced_1');
        stats = useShipStore.getState().getTotalStats();
        expect(stats.health).toBe(150); // 100 + 50
        expect(stats.speed).toBe(5); // 10 - 5
    });
});
