import type { StateCreator } from 'zustand';
import type { GameStore, PartyManagementSlice } from '../interfaces';

export const createPartyManagementSlice: StateCreator<GameStore, [], [], PartyManagementSlice> = (set, get) => ({
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
                    [companionId]: { level: maxLevel }
                }
            });
        }
    },
});
