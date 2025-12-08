import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerState {
    name: string;
    currentAdventure: number;
    unlockedAdventures: number[];

    // Actions
    setName: (name: string) => void;
    unlockAdventure: (adventureId: number) => void;
    resetProgress: () => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({
            name: 'Cadet',
            currentAdventure: 1,
            unlockedAdventures: [1],

            setName: (name) => set({ name }),

            unlockAdventure: (adventureId) =>
                set((state) => ({
                    unlockedAdventures: state.unlockedAdventures.includes(adventureId)
                        ? state.unlockedAdventures
                        : [...state.unlockedAdventures, adventureId]
                })),

            resetProgress: () => set({
                name: 'Cadet',
                currentAdventure: 1,
                unlockedAdventures: [1],
            })
        }),
        {
            name: 'space-math-player-storage',
        }
    )
);
