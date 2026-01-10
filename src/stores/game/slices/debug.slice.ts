import type { StateCreator } from 'zustand';
import type { GameStore, DebugSlice } from '../interfaces';
import { COMPANIONS } from '../../../data/companions.data';
import { ADVENTURES } from '../../../data/adventures.data';

export const createDebugSlice: StateCreator<GameStore, [], [], DebugSlice> = (set) => ({
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
                acc[id] = { level: 1 };
                return acc;
            }, {} as Record<string, { level: number }>)
        });
    },

    debugResetEncounterResults: () => set({ encounterResults: {} }),

    debugSetCompanionLevel: (companionId, level) => set((state) => ({
        companionStats: {
            ...state.companionStats,
            [companionId]: {
                level
            }
        }
    })),

    debugSetEncounterStars: (adventureId, nodeIndex, stars) => set((state) => {
        const key = `${adventureId}_${nodeIndex}`;
        const existing = state.encounterResults[key];
        return {
            encounterResults: {
                ...state.encounterResults,
                [key]: {
                    stars,
                    difficulty: existing?.difficulty ?? 1,
                    completedAt: existing?.completedAt ?? Date.now()
                }
            }
        };
    })
});
