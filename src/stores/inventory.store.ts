import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InventoryState {
    ownedModuleIds: string[];

    // Actions
    unlockModule: (moduleId: string) => void;
    hasModule: (moduleId: string) => boolean;
    resetInventory: () => void;
}

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set, get) => ({
            ownedModuleIds: ['weapon_laser_1', 'shield_basic_1'], // Default starting items

            unlockModule: (moduleId) =>
                set((state) => ({
                    ownedModuleIds: state.ownedModuleIds.includes(moduleId)
                        ? state.ownedModuleIds
                        : [...state.ownedModuleIds, moduleId]
                })),

            hasModule: (moduleId) => get().ownedModuleIds.includes(moduleId),

            resetInventory: () => set({
                ownedModuleIds: ['weapon_laser_1', 'shield_basic_1']
            })
        }),
        {
            name: 'space-math-inventory-storage',
        }
    )
);
