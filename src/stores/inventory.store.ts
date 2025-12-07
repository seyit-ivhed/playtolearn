import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InventoryState {
    unlockedCompanions: string[]; // Array of companion IDs
    credits: number;

    // Actions
    unlockCompanion: (companionId: string) => void;
    addCredits: (amount: number) => void;
    spendCredits: (amount: number) => boolean;
    hasCompanion: (companionId: string) => boolean;
}

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set, get) => ({
            unlockedCompanions: ['companion_fire_knight', 'companion_crystal_guardian'], // Starting companions
            credits: 0,

            unlockCompanion: (companionId) =>
                set((state) => ({
                    unlockedCompanions: state.unlockedCompanions.includes(companionId)
                        ? state.unlockedCompanions
                        : [...state.unlockedCompanions, companionId]
                })),

            addCredits: (amount) =>
                set((state) => ({ credits: state.credits + amount })),

            spendCredits: (amount) => {
                const { credits } = get();
                if (credits >= amount) {
                    set({ credits: credits - amount });
                    return true;
                }
                return false;
            },

            hasCompanion: (companionId) => get().unlockedCompanions.includes(companionId)
        }),
        {
            name: 'inventory-storage',
        }
    )
);
