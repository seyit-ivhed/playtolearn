import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShipLoadout, ShipStats } from '../types/ship.types';
import { getModuleById } from '../data/modules.data';
import { SHIP_SLOTS } from '../data/slots.data';

export interface ShipState {
    loadout: ShipLoadout;
    baseStats: ShipStats;

    // Actions
    equipModule: (slotId: string, moduleId: string) => void;
    unequipModule: (slotId: string) => void;
    resetShip: () => void;

    // Computed
    getTotalStats: () => ShipStats;
}

// Initialize loadout from SHIP_SLOTS
const INITIAL_LOADOUT: ShipLoadout = SHIP_SLOTS.reduce((acc, slot) => {
    acc[slot.id] = slot.equippedModuleId;
    return acc;
}, {} as ShipLoadout);

const BASE_STATS: ShipStats = {
    health: 100,
    maxHealth: 100,
    energy: 50,
    maxEnergy: 50,
    attack: 0,
    defense: 0,
    speed: 10
};

export const useShipStore = create<ShipState>()(
    persist(
        (set, get) => ({
            loadout: INITIAL_LOADOUT,
            baseStats: BASE_STATS,

            equipModule: (slotId, moduleId) =>
                set((state) => ({
                    loadout: { ...state.loadout, [slotId]: moduleId }
                })),

            unequipModule: (slotId) =>
                set((state) => ({
                    loadout: { ...state.loadout, [slotId]: null }
                })),

            resetShip: () => set({
                loadout: INITIAL_LOADOUT,
                baseStats: BASE_STATS
            }),

            getTotalStats: () => {
                const state = get();
                const totalStats = { ...state.baseStats };

                Object.values(state.loadout).forEach(moduleId => {
                    if (moduleId) {
                        const module = getModuleById(moduleId);
                        if (module && module.stats) {
                            if (module.stats.health) totalStats.health += module.stats.health;
                            if (module.stats.energy) totalStats.energy += module.stats.energy;
                            if (module.stats.attack) totalStats.attack += module.stats.attack;
                            if (module.stats.defense) totalStats.defense += module.stats.defense;
                            if (module.stats.speed) totalStats.speed += module.stats.speed;
                        }
                    }
                });

                return totalStats;
            }
        }),
        {
            name: 'space-math-ship-storage',
        }
    )
);
