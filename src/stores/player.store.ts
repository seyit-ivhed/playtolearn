import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerState {

    language: 'en' | 'sv';
    currentAdventure: number;
    unlockedAdventures: number[];

    // Actions

    setLanguage: (lang: 'en' | 'sv') => void;
    unlockAdventure: (adventureId: number) => void;
    setCurrentAdventure: (adventureId: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({

            language: 'en',
            currentAdventure: 1,
            unlockedAdventures: [1],

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
