import type { StateCreator } from 'zustand';
import type { GameStore, ProgressionSlice } from '../interfaces';
import { PersistenceService } from '../../../services/persistence.service';

export const createProgressionSlice: StateCreator<GameStore, [], [], ProgressionSlice> = (set, get) => ({
    levelUpCompanion: (companionId: string) => {
        const state = get();
        const stats = state.companionStats[companionId] || { level: 1 };

        const level = typeof stats.level === 'number' ? stats.level : 1;

        set({
            companionStats: {
                ...state.companionStats,
                [companionId]: { level: level + 1 }
            }
        });

        PersistenceService.sync(get());
    },

    addCompanionToParty: (companionId: string) => {
        const { activeParty } = get();

        if (activeParty.includes(companionId)) return;

        set({ activeParty: [...activeParty, companionId] });

        PersistenceService.sync(get());
    },
});
