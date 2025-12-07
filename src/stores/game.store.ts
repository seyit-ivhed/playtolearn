import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_FELLOWSHIP } from '../data/companions.data';

interface GameState {
    // Progression
    currentMapNode: number; // 1-5
    unlockedCompanions: string[]; // IDs
    activeParty: string[]; // IDs (Max 4)

    // Actions
    completeEncounter: () => void;
    resetMap: () => void;
    addToParty: (companionId: string) => void;
    removeFromParty: (companionId: string) => void;
    unlockCompanion: (companionId: string) => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            currentMapNode: 1,
            unlockedCompanions: [...INITIAL_FELLOWSHIP],
            activeParty: [...INITIAL_FELLOWSHIP], // Default full party

            completeEncounter: () => {
                const { currentMapNode } = get();
                if (currentMapNode < 5) {
                    set({ currentMapNode: currentMapNode + 1 });
                } else {
                    // Loop or Finish? For now, reset to 1
                    set({ currentMapNode: 1 });
                }
            },

            resetMap: () => set({ currentMapNode: 1 }),

            addToParty: (companionId) => {
                const { activeParty, unlockedCompanions } = get();
                if (activeParty.length >= 4) return; // Full
                if (activeParty.includes(companionId)) return; // Already in
                if (!unlockedCompanions.includes(companionId)) return; // Not unlocked

                set({ activeParty: [...activeParty, companionId] });
            },

            removeFromParty: (companionId) => {
                const { activeParty } = get();
                set({ activeParty: activeParty.filter(id => id !== companionId) });
            },

            unlockCompanion: (companionId) => {
                const { unlockedCompanions } = get();
                if (!unlockedCompanions.includes(companionId)) {
                    set({ unlockedCompanions: [...unlockedCompanions, companionId] });
                }
            }
        }),
        {
            name: 'math-quest-fantasy-storage-v1',
        }
    )
);
