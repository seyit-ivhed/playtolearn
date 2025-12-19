import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_FELLOWSHIP, COMPANIONS } from '../data/companions.data';
import { getXpForNextLevel } from '../utils/progression.utils';

import { ADVENTURES } from '../data/adventures.data';

interface GameState {
    // Progression
    currentMapNode: number; // 1-indexed, relative to current adventure
    activeAdventureId: string;
    unlockedCompanions: string[]; // IDs
    activeParty: string[]; // IDs (Max 4)

    // Progression System
    xpPool: number;
    companionStats: Record<string, { level: number; xp: number }>;
    restedCompanions: string[]; // IDs of companions who are rested

    // Actions
    completeEncounter: () => void;
    setActiveAdventure: (adventureId: string) => void;
    resetMap: () => void;
    addToParty: (companionId: string) => void;
    removeFromParty: (companionId: string) => void;
    unlockCompanion: (companionId: string) => void;

    // Progression Actions
    addXpToPool: (amount: number) => void;
    assignXpToCompanion: (companionId: string, amount: number) => void;
    markRestedCompanions: () => void; // Call when starting adventure
    consumeRestedBonus: (companionId: string) => void; // Call when bonus used

    resetAll: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            currentMapNode: 1,
            activeAdventureId: '1',
            unlockedCompanions: [...INITIAL_FELLOWSHIP],
            activeParty: [...INITIAL_FELLOWSHIP], // Default full party

            xpPool: 0,
            companionStats: Object.keys(COMPANIONS).reduce((acc, id) => {
                acc[id] = { level: 1, xp: 0 };
                return acc;
            }, {} as Record<string, { level: number; xp: number }>),
            restedCompanions: [],

            completeEncounter: () => {
                const { currentMapNode, activeAdventureId, addXpToPool } = get();
                const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

                if (!adventure) return;

                // Grant XP for the current encounter before moving to the next
                const currentEncounter = adventure.encounters[currentMapNode - 1];
                if (currentEncounter && currentEncounter.xpReward) {
                    addXpToPool(currentEncounter.xpReward);
                }

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
                const { unlockedCompanions, companionStats } = get();
                if (!unlockedCompanions.includes(companionId)) {
                    // New companion joins at (Max Party Level) to catch up
                    const levels = Object.values(companionStats).map(s => s.level);
                    const maxLevel = Math.max(...levels, 1);

                    set({
                        unlockedCompanions: [...unlockedCompanions, companionId],
                        companionStats: {
                            ...companionStats,
                            [companionId]: { level: maxLevel, xp: 0 }
                        }
                    });
                }
            },

            addXpToPool: (amount) => set((state) => ({ xpPool: state.xpPool + amount })),

            assignXpToCompanion: (companionId, amount) => {
                const state = get();
                if (state.xpPool < amount) return;

                const stats = state.companionStats[companionId] || { level: 1, xp: 0 };
                let newXp = stats.xp + amount;
                let newLevel = stats.level;

                // Simple while loop for multi-lebel up (though unrealistic with small amounts)
                let xpNeeded = getXpForNextLevel(newLevel);
                while (newXp >= xpNeeded) {
                    newXp -= xpNeeded;
                    newLevel++;
                    xpNeeded = getXpForNextLevel(newLevel);
                }

                set({
                    xpPool: state.xpPool - amount,
                    companionStats: {
                        ...state.companionStats,
                        [companionId]: { level: newLevel, xp: newXp }
                    }
                });
            },

            markRestedCompanions: () => {
                const { activeParty, unlockedCompanions } = get();
                // Everyone NOT in active party gets rested
                const rested = unlockedCompanions.filter(id => !activeParty.includes(id));
                set({ restedCompanions: rested });
            },

            consumeRestedBonus: (companionId) => {
                const { restedCompanions } = get();
                if (restedCompanions.includes(companionId)) {
                    set({ restedCompanions: restedCompanions.filter(id => id !== companionId) });
                }
            },

            resetAll: () => {
                set({
                    currentMapNode: 1,
                    activeAdventureId: '1',
                    unlockedCompanions: [...INITIAL_FELLOWSHIP],
                    activeParty: [...INITIAL_FELLOWSHIP],
                    xpPool: 0,
                    companionStats: Object.keys(COMPANIONS).reduce((acc, id) => {
                        acc[id] = { level: 1, xp: 0 };
                        return acc;
                    }, {} as Record<string, { level: number; xp: number }>),
                    restedCompanions: []
                });
            }
        }),
        {
            name: 'math-quest-fantasy-storage-v1',
        }
    )
);
