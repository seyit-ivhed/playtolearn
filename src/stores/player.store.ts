import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DifficultyLevel } from '../types/math.types';

export interface PlayerState {
    name: string;
    difficulty: DifficultyLevel;
    currentAdventure: number;
    unlockedAdventures: number[];

    // Actions
    setName: (name: string) => void;
    setDifficulty: (difficulty: DifficultyLevel) => void;
    unlockAdventure: (adventureId: number) => void;
    resetProgress: () => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({
            name: 'Cadet',
            difficulty: 3, // Default to middle ground (Age 8)
            currentAdventure: 1,
            unlockedAdventures: [1],

            setName: (name) => set({ name }),
            setDifficulty: (difficulty) => set({ difficulty }),

            unlockAdventure: (adventureId) =>
                set((state) => ({
                    unlockedAdventures: state.unlockedAdventures.includes(adventureId)
                        ? state.unlockedAdventures
                        : [...state.unlockedAdventures, adventureId]
                })),

            resetProgress: () => set({
                name: 'Cadet',
                difficulty: 3,
                currentAdventure: 1,
                unlockedAdventures: [1],
            })
        }),
        {
            name: 'space-math-player-storage',
        }
    )
);
