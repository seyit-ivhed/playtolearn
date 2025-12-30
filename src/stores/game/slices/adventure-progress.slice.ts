import type { StateCreator } from 'zustand';
import type { GameStore, AdventureProgressSlice } from '../interfaces';
import { ADVENTURES } from '../../../data/adventures.data';

export const createAdventureProgressSlice: StateCreator<GameStore, [], [], AdventureProgressSlice> = (set, get) => ({
    completeEncounter: (nodeIndex) => {
        const { currentMapNode, activeAdventureId, addXpToPool, activeEncounterDifficulty, encounterResults } = get();
        const adventure = ADVENTURES.find(a => a.id === activeAdventureId);

        if (!adventure) return;

        // Use provided nodeIndex or fallback to current
        const completedIndex = nodeIndex ?? currentMapNode;

        // Unique key for this encounter
        const encounterKey = `${activeAdventureId}_${completedIndex}`;
        const existingResult = encounterResults[encounterKey];

        // Grant dynamic XP only if first time completion
        if (!existingResult) {
            const encounter = adventure.encounters[completedIndex - 1];
            const xpReward = encounter?.xpReward ?? 0;
            addXpToPool(xpReward);
        }

        // Update encounter results
        const newStars = activeEncounterDifficulty; // 1:1 ratio as requested
        const shouldUpdateResult = !existingResult || newStars > existingResult.stars;

        if (shouldUpdateResult) {
            set((state) => ({
                encounterResults: {
                    ...state.encounterResults,
                    [encounterKey]: {
                        stars: newStars,
                        difficulty: activeEncounterDifficulty,
                        completedAt: Date.now(),
                    }
                }
            }));
        }

        // Only increment currentMapNode if we completed the latest unlocked node
        if (completedIndex >= currentMapNode) {
            if (currentMapNode < adventure.encounters.length) {
                set({ currentMapNode: currentMapNode + 1 });
            } else {
                // Adventure Completed (Loop for now, or handle win state)
                set({ currentMapNode: 1 });
            }
        }
    },

    setEncounterDifficulty: (difficulty) => set({ activeEncounterDifficulty: difficulty }),

    setActiveAdventure: (adventureId, initialNode) => {
        set({ activeAdventureId: adventureId, currentMapNode: initialNode ?? 1 });
    },

    resetMap: () => set({ currentMapNode: 1 }),

    updateChroniclePosition: (volumeId, adventureId) => {
        set((state) => ({
            chronicle: {
                ...state.chronicle,
                lastViewedVolumeId: volumeId,
                lastViewedAdventureId: adventureId,
            }
        }));
    },
});

