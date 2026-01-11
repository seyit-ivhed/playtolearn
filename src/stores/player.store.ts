import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerState {

    language: 'en' | 'sv';
    currentAdventure: number;

    // Actions

    setLanguage: (lang: 'en' | 'sv') => void;
    setCurrentAdventure: (adventureId: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({

            language: 'en',
            currentAdventure: 1,

            setLanguage: (language) => set({ language }),

            setCurrentAdventure: (currentAdventure) => set({ currentAdventure })
        }),
        {
            name: 'space-math-player-storage',
        }
    )
);
