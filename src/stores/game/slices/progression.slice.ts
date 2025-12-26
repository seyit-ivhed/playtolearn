import type { StateCreator } from 'zustand';
import type { GameStore, ProgressionSlice } from '../interfaces';
import { getXpForNextLevel } from '../../../utils/progression.utils';

export const createProgressionSlice: StateCreator<GameStore, [], [], ProgressionSlice> = (set, get) => ({
    addXpToPool: (amount) => set((state) => ({ xpPool: state.xpPool + amount })),

    assignXpToCompanion: (companionId, amount) => {
        const state = get();
        if (state.xpPool < amount) return;

        const stats = state.companionStats[companionId] || { level: 1, xp: 0 };
        let newXp = stats.xp + amount;
        let newLevel = stats.level;

        // Simple while loop for multi-lebel up (though unrealistic with small amounts)
        // Cap level at 10 for Free Tier MVP
        let xpNeeded = getXpForNextLevel(newLevel);
        const LEVEL_CAP = 10;
        while (newXp >= xpNeeded && newLevel < LEVEL_CAP) {
            newXp -= xpNeeded;
            newLevel++;
            xpNeeded = getXpForNextLevel(newLevel);
        }

        if (newLevel === LEVEL_CAP) {
            newXp = 0;
        }

        set({
            xpPool: Math.max(0, (state.xpPool || 0) - amount),
            companionStats: {
                ...state.companionStats,
                [companionId]: { level: newLevel, xp: newXp }
            }
        });
    },

    levelUpCompanion: (companionId) => {
        const state = get();
        const stats = state.companionStats[companionId] || { level: 1, xp: 0 };

        const level = typeof stats.level === 'number' ? stats.level : 1;
        const xp = typeof stats.xp === 'number' ? stats.xp : 0;
        const pool = typeof state.xpPool === 'number' ? state.xpPool : 0;

        const LEVEL_CAP = 10;
        if (level >= LEVEL_CAP) return;

        const xpNeeded = getXpForNextLevel(level);
        const actualXpNeeded = Math.max(0, xpNeeded - xp);

        if (pool < actualXpNeeded) return;

        set({
            xpPool: Math.max(0, pool - actualXpNeeded),
            companionStats: {
                ...state.companionStats,
                [companionId]: { level: level + 1, xp: 0 }
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
});
