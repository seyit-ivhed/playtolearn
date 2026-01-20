import type { StateCreator } from 'zustand';
import type { GameStore, AdventureProgressSlice } from '../interfaces';
import { ADVENTURES } from '../../../data/adventures.data';
import { PersistenceService } from '../../../services/persistence.service';
import { EncounterType } from '../../../types/adventure.types';

export const createAdventureProgressSlice: StateCreator<GameStore, [], [], AdventureProgressSlice> = (set, get) => ({
    completeEncounter: (adventureId, nodeIndex) => {
        const { addXpToPool, encounterResults, addCompanionToParty } = get();

        // Permanent joining logic for Kenji
        if (adventureId === '3' && nodeIndex === 1) {
            addCompanionToParty('kenji');
        }

        const adventure = ADVENTURES.find(a => a.id === adventureId);

        if (!adventure) return;

        const encounter = adventure.encounters[nodeIndex - 1];

        // Unique key for this encounter
        const encounterKey = `${adventureId}_${nodeIndex}`;
        const existingResult = encounterResults[encounterKey];

        // Grant dynamic XP only if first time completion
        if (!existingResult) {
            const xpReward = encounter?.xpReward ?? 0;
            addXpToPool(xpReward);
        }

        // Update encounter results ONLY for rated types (Battle, Boss, Puzzle)
        const isRatedType = encounter?.type !== EncounterType.CAMP && encounter?.type !== EncounterType.ENDING;

        if (isRatedType) {
            const { activeEncounterDifficulty } = get();
            const newStars = activeEncounterDifficulty;
            const shouldUpdateResult = !existingResult || newStars > existingResult.stars;

            if (shouldUpdateResult) {
                set((state) => {
                    const newResults = {
                        ...state.encounterResults,
                        [encounterKey]: {
                            stars: newStars,
                            difficulty: activeEncounterDifficulty,
                            completedAt: Date.now(),
                        }
                    };

                    return {
                        encounterResults: newResults,
                    };
                });
            }
        }

        // Trigger cloud sync
        PersistenceService.sync(get());
    },

    setEncounterDifficulty: (difficulty) => set({ activeEncounterDifficulty: difficulty }),

    getAdventureNodes: (adventureId) => {
        const { encounterResults } = get();
        const adventure = ADVENTURES.find(a => a.id === adventureId);

        if (!adventure) return [];

        let lastUnlockedNodeCompleted = true; // First node is always unlocked

        return adventure.encounters.map((node, index) => {
            const nodeStep = index + 1;
            const encounterKey = `${adventureId}_${nodeStep}`;
            const result = encounterResults[encounterKey];
            const stars = result?.stars || 0;
            const isCompleted = stars > 0;
            const isLocked = !isCompleted && !lastUnlockedNodeCompleted;

            if (node.type !== EncounterType.CAMP && node.type !== EncounterType.ENDING) {
                // This is a "blocker" node. If it's not completed, the *next* node will be locked.
                lastUnlockedNodeCompleted = isCompleted;
            }

            return {
                ...node,
                isLocked,
                stars
            };
        });
    }
});
