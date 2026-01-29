import type { StateCreator } from 'zustand';
import type { GameStore, ProgressionSlice } from '../interfaces';
import { PersistenceService } from '../../../services/persistence.service';
import { EXPERIENCE_CONFIG, getRequiredXpForNextLevel } from '../../../data/experience.data';

export const createProgressionSlice: StateCreator<GameStore, [], [], ProgressionSlice> = (set, get) => ({
    levelUpCompanion: (companionId: string) => {
        const state = get();
        const stats = state.companionStats[companionId];

        if (!stats) {
            console.error(`Companion stats not found for ${companionId} in levelUpCompanion`);
            return;
        }

        if (typeof stats.level !== 'number') {
            console.error(`Invalid level for companion ${companionId} in levelUpCompanion`);
            return;
        }

        const level = stats.level;

        if (level >= EXPERIENCE_CONFIG.MAX_LEVEL) {
            console.error(`Companion ${companionId} is already at max level`);
            return;
        }

        const requiredXp = getRequiredXpForNextLevel(level);
        const currentXp = stats.experience || 0;

        if (currentXp < requiredXp) {
            console.error(`Insufficient experience to level up ${companionId}. Required: ${requiredXp}, Current: ${currentXp}`);
            return;
        }

        set({
            companionStats: {
                ...state.companionStats,
                [companionId]: {
                    level: level + 1,
                    experience: currentXp - requiredXp
                }
            }
        });

        PersistenceService.sync(get());
    },

    addCompanionExperience: (companionId: string, amount: number) => {
        const state = get();
        const stats = state.companionStats[companionId];

        if (!stats) {
            console.error(`Companion stats not found for ${companionId} in addCompanionExperience`);
            return;
        }

        if (typeof stats.level !== 'number') {
            console.error(`Invalid level for companion ${companionId} in addCompanionExperience`);
            return;
        }

        const level = stats.level;

        if (level >= EXPERIENCE_CONFIG.MAX_LEVEL) {
            console.error(`Companion ${companionId} is already at max level`);
            return;
        }

        const currentXp = stats.experience || 0;

        set({
            companionStats: {
                ...state.companionStats,
                [companionId]: {
                    ...stats,
                    level,
                    experience: currentXp + amount
                }
            }
        });

        PersistenceService.sync(get());
    },

    addCompanionToParty: (companionId: string) => {
        const { activeParty } = get();

        if (activeParty.includes(companionId)) {
            return;
        }

        set({ activeParty: [...activeParty, companionId] });

        PersistenceService.sync(get());
    },
});
