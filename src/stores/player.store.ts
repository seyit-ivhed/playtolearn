import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DifficultyLevel } from '../types/math.types';

export interface PlayerState {

    difficulty: DifficultyLevel;
    language: 'en' | 'sv';
    currentAdventure: number;
    unlockedAdventures: number[];

    // Actions

    setDifficulty: (difficulty: DifficultyLevel) => void;
    setLanguage: (lang: 'en' | 'sv') => void;
    unlockAdventure: (adventureId: number) => void;
    setCurrentAdventure: (adventureId: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({

            difficulty: 1, // Default to lowest (Apprentice)
            language: 'en',
            currentAdventure: 1,
            unlockedAdventures: [1],

            setDifficulty: (difficulty) => set({ difficulty }),
            setLanguage: (language) => set({ language }),

            unlockAdventure: (adventureId) =>
                set((state) => ({
                    unlockedAdventures: state.unlockedAdventures.includes(adventureId)
                        ? state.unlockedAdventures
                        : [...state.unlockedAdventures, adventureId]
                })),

            setCurrentAdventure: (currentAdventure) => set({ currentAdventure })
        }),
        {
            name: 'space-math-player-storage',
        }
    )
);
