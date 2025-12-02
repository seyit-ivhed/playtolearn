import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerState {
    name: string;
    currentMission: number;
    unlockedMissions: number[];

    // Actions
    setName: (name: string) => void;
    unlockMission: (missionId: number) => void;
    resetProgress: () => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set) => ({
            name: 'Cadet',
            currentMission: 1,
            unlockedMissions: [1],

            setName: (name) => set({ name }),

            unlockMission: (missionId) =>
                set((state) => ({
                    unlockedMissions: state.unlockedMissions.includes(missionId)
                        ? state.unlockedMissions
                        : [...state.unlockedMissions, missionId]
                })),

            resetProgress: () => set({
                name: 'Cadet',
                currentMission: 1,
                unlockedMissions: [1],
            })
        }),
        {
            name: 'space-math-player-storage',
        }
    )
);
