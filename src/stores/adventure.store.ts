import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdventureStatus, type AdventureId } from '../types/adventure.types';
import { ADVENTURES } from '../data/adventures.data';

export interface AdventureState {
    adventureStatuses: Record<AdventureId, AdventureStatus>;

    // Actions
    completeAdventure: (id: AdventureId) => void;
    unlockAdventure: (id: AdventureId) => void;

    // Computed
    isAdventureUnlocked: (id: AdventureId) => boolean;
}

const INITIAL_STATUSES: Record<AdventureId, AdventureStatus> = {
    'prologue': AdventureStatus.AVAILABLE,
    '1': AdventureStatus.AVAILABLE
};

export const useAdventureStore = create<AdventureState>()(
    persist(
        (set, get) => ({
            adventureStatuses: INITIAL_STATUSES,

            completeAdventure: (id) => {
                const currentStatuses = get().adventureStatuses;

                // Mark current as completed
                const newStatuses = {
                    ...currentStatuses,
                    [id]: AdventureStatus.COMPLETED
                };

                // Find and unlock next adventure
                const currentAdventureIndex = ADVENTURES.findIndex(m => m.id === id);
                if (currentAdventureIndex !== -1 && currentAdventureIndex < ADVENTURES.length - 1) {
                    const nextAdventure = ADVENTURES[currentAdventureIndex + 1];
                    // Only unlock if it's currently LOCKED (don't overwrite if already completed/available)
                    if (!newStatuses[nextAdventure.id]) {
                        newStatuses[nextAdventure.id] = AdventureStatus.AVAILABLE;
                    }
                }

                set({ adventureStatuses: newStatuses });
            },

            unlockAdventure: (id) =>
                set((state) => ({
                    adventureStatuses: {
                        ...state.adventureStatuses,
                        [id]: AdventureStatus.AVAILABLE
                    }
                })),

            isAdventureUnlocked: (id) => {
                const status = get().adventureStatuses[id];
                return status === AdventureStatus.AVAILABLE || status === AdventureStatus.COMPLETED;
            }
        }),
        {
            name: 'math-quest-adventure-storage',
        }
    )
);
