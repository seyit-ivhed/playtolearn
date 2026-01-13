import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerState {

    language: 'en' | 'sv';

    // Actions

    setLanguage: (lang: 'en' | 'sv') => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({

            language: 'en',

            setLanguage: (language) => set({ language }),
        }),
        {
            name: 'space-math-player-storage',
        }
    )
);
