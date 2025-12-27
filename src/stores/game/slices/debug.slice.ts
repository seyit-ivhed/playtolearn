import type { StateCreator } from 'zustand';
import type { GameStore, DebugSlice } from '../interfaces';
import { INITIAL_FELLOWSHIP, COMPANIONS } from '../../../data/companions.data';
import { ADVENTURES } from '../../../data/adventures.data';

export const createDebugSlice: StateCreator<GameStore, [], [], DebugSlice> = (set) => ({
    debugSetMapNode: (node) => set({ currentMapNode: node }),

    debugUnlockAllCompanions: () => {
        const companionIds = Object.keys(COMPANIONS);
        set({ unlockedCompanions: companionIds });
    },

    debugUnlockAllEncounters: () => {
        const results: Record<string, { stars: number; difficulty: number; completedAt: number }> = {};
        ADVENTURES.forEach((adv) => {
            adv.encounters.forEach((_, idx) => {
                results[`${adv.id}_${idx + 1}`] = {
                    stars: 3,
                    difficulty: 3,
                    completedAt: Date.now()
                };
            });
        });
        set({ encounterResults: results });
    },

    debugAddXp: (amount) => set((state) => ({ xpPool: state.xpPool + amount })),

    debugResetXpPool: () => set({ xpPool: 0 }),

    debugResetCompanions: () => {
        set({
            companionStats: Object.keys(COMPANIONS).reduce((acc, id) => {
                acc[id] = { level: 1, xp: 0 };
                return acc;
            }, {} as Record<string, { level: number; xp: number }>)
        });
    },

    debugResetEncounterResults: () => set({ encounterResults: {} }),

    resetAll: () => {
        set({
            currentMapNode: 1,
            activeAdventureId: '1',
            unlockedCompanions: [...INITIAL_FELLOWSHIP],
            activeParty: [...INITIAL_FELLOWSHIP],
            encounterResults: {},
            activeEncounterDifficulty: 1,
            xpPool: 0,
            companionStats: Object.keys(COMPANIONS).reduce((acc, id) => {
                acc[id] = { level: 1, xp: 0 };
                return acc;
            }, {} as Record<string, { level: number; xp: number }>),
            restedCompanions: []
        });
    }
});
