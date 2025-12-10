import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_FELLOWSHIP } from '../data/companions.data';

import { ADVENTURES } from '../data/adventures.data';

interface GameState {
    // Progression
    currentMapNode: number; // 1-indexed, relative to current adventure
    activeAdventureId: string;
    unlockedCompanions: string[]; // IDs
    activeParty: string[]; // IDs (Max 4)

    // Actions
    completeEncounter: () => void;
    setActiveAdventure: (adventureId: string) => void;
    resetMap: () => void;
    addToParty: (companionId: string) => void;
    removeFromParty: (companionId: string) => void;
    unlockCompanion: (companionId: string) => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            currentMapNode: 1,
            activeAdventureId: '1',
            unlockedCompanions: [...INITIAL_FELLOWSHIP],
            activeParty: [...INITIAL_FELLOWSHIP], // Default full party

            completeEncounter: () => {
                const { currentMapNode, activeAdventureId } = get();
                const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

                if (!adventure) return;

                // Check if there are more encounters
                if (currentMapNode < adventure.encounters.length) {
                    set({ currentMapNode: currentMapNode + 1 });
                } else {
                    // Adventure Completed (Loop for now, or handle win state)
                    // For prototype, just loop back to 1 or stay at end?
                    // Let's reset to 1 for infinite play in prototype
                    set({ currentMapNode: 1 });
                }
            },

            setActiveAdventure: (adventureId) => {
                set({ activeAdventureId: adventureId, currentMapNode: 1 });
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
