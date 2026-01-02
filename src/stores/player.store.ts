import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DifficultyLevel } from '../types/math.types';

export interface PlayerState {
    name: string;
    difficulty: DifficultyLevel;
    language: 'en' | 'sv';
    currentAdventure: number;
    unlockedAdventures: number[];

    // Actions
    setName: (name: string) => void;
    setDifficulty: (difficulty: DifficultyLevel) => void;
    setLanguage: (lang: 'en' | 'sv') => void;
    unlockAdventure: (adventureId: number) => void;
    setCurrentAdventure: (adventureId: number) => void;
    resetProgress: () => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({
            name: 'Cadet',
            difficulty: 1, // Default to lowest (Apprentice)
            language: 'en',
            currentAdventure: 1,
            unlockedAdventures: [1],

            setName: (name) => set({ name }),
            setDifficulty: (difficulty) => set({ difficulty }),
            setLanguage: (language) => set({ language }),

            unlockAdventure: (adventureId) =>
                set((state) => ({
                    unlockedAdventures: state.unlockedAdventures.includes(adventureId)
                        ? state.unlockedAdventures
                        : [...state.unlockedAdventures, adventureId]
                })),

            setCurrentAdventure: (currentAdventure) => set({ currentAdventure }),

            resetProgress: () => set((state) => ({
                name: 'Cadet',
                difficulty: state.difficulty,
                language: state.language,
                currentAdventure: 1,
                unlockedAdventures: [1],
            }))
        }),
        {
            name: 'space-math-player-storage',
        }
    )
);
