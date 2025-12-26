import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_FELLOWSHIP, COMPANIONS } from '../data/companions.data';
import { getXpForNextLevel } from '../utils/progression.utils';

import { ADVENTURES } from '../data/adventures.data';

export interface EncounterResult {
    stars: number;
    difficulty: number;
    completedAt: number;
}

interface GameState {
    // Progression
    currentMapNode: number; // 1-indexed, relative to current adventure
    activeAdventureId: string;
    unlockedCompanions: string[]; // IDs
    activeParty: string[]; // IDs (Max 4)

    // Per-Encounter Progression
    encounterResults: Record<string, EncounterResult>; // Key: adventureId_nodeIndex
    activeEncounterDifficulty: number;

    // Progression System
    xpPool: number;
    companionStats: Record<string, { level: number; xp: number }>;
    restedCompanions: string[]; // IDs of companions who are rested

    // Actions
    completeEncounter: (nodeIndex?: number) => void;
    setEncounterDifficulty: (difficulty: number) => void;
    setActiveAdventure: (adventureId: string) => void;
    resetMap: () => void;
    addToParty: (companionId: string) => void;
    removeFromParty: (companionId: string) => void;
    unlockCompanion: (companionId: string) => void;

    // Progression Actions
    addXpToPool: (amount: number) => void;
    assignXpToCompanion: (companionId: string, amount: number) => void;
    levelUpCompanion: (companionId: string) => void;
    consumeRestedBonus: (companionId: string) => void; // Call when bonus used
    markRestedCompanions: () => void; // Call when starting adventure

    // Debug Actions
    debugSetMapNode: (node: number) => void;
    debugUnlockAllCompanions: () => void;
    debugAddXp: (amount: number) => void;
    debugResetXpPool: () => void;
    debugResetCompanions: () => void;
    debugResetEncounterResults: () => void;

    resetAll: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            currentMapNode: 1,
            activeAdventureId: '1',
            unlockedCompanions: [...INITIAL_FELLOWSHIP],
            activeParty: [...INITIAL_FELLOWSHIP], // Default full party

            encounterResults: {},
            activeEncounterDifficulty: 1,

            xpPool: 0,
            companionStats: Object.keys(COMPANIONS).reduce((acc, id) => {
                acc[id] = { level: 1, xp: 0 };
                return acc;
            }, {} as Record<string, { level: number; xp: number }>),
            restedCompanions: [],

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

            // Debug Actions
            debugSetMapNode: (node) => set({ currentMapNode: node }),

            debugUnlockAllCompanions: () => {
                const companionIds = Object.keys(COMPANIONS);
                set({ unlockedCompanions: companionIds });
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
        }),
        {
            name: 'math-quest-fantasy-storage-v1',
        }
    )
);
