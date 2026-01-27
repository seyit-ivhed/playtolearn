import type { StateCreator } from 'zustand';
import type { GameStore, DebugSlice } from '../interfaces';
import { COMPANIONS } from '../../../data/companions.data';

export const createDebugSlice: StateCreator<GameStore, [], [], DebugSlice> = (set, get) => ({

    debugResetCompanions: () => {
        set({
            companionStats: Object.keys(COMPANIONS).reduce((acc, id) => {
                acc[id] = { level: 1, experience: 0 };
                return acc;
            }, {} as Record<string, { level: number; experience: number }>)
        });
    },

    debugResetEncounterResults: () => set({ encounterResults: {} }),

    debugSetCompanionLevel: (companionId, level) => {
        const { companionStats } = get();
        set({
            companionStats: {
                ...companionStats,
                [companionId]: {
                    ...companionStats[companionId],
                    level
                }
            }
        });
    },

    debugSetEncounterStars: (adventureId, nodeIndex, stars) => {
        const { encounterResults } = get();
        const key = `${adventureId}_${nodeIndex}`;
        const existing = encounterResults[key];
        set({
            encounterResults: {
                ...encounterResults,
                [key]: {
                    stars,
                    difficulty: existing?.difficulty ?? 1,
                    completedAt: existing?.completedAt ?? Date.now()
                }
            }
        });
    }
});
