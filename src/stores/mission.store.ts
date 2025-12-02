import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MissionStatus, type MissionId } from '../types/mission.types';
import { MISSIONS } from '../data/missions.data';

interface MissionState {
    missionStatuses: Record<MissionId, MissionStatus>;

    // Actions
    completeMission: (id: MissionId) => void;
    unlockMission: (id: MissionId) => void;
    resetProgress: () => void;

    // Computed
    getMissionStatus: (id: MissionId) => MissionStatus;
    getAvailableMissions: () => string[]; // Returns IDs
    isMissionUnlocked: (id: MissionId) => boolean;
}

const INITIAL_STATUSES: Record<MissionId, MissionStatus> = {
    '1': MissionStatus.AVAILABLE // First mission is always available
};

export const useMissionStore = create<MissionState>()(
    persist(
        (set, get) => ({
            missionStatuses: INITIAL_STATUSES,

            completeMission: (id) => {
                const currentStatuses = get().missionStatuses;

                // Mark current as completed
                const newStatuses = {
                    ...currentStatuses,
                    [id]: MissionStatus.COMPLETED
                };

                // Find and unlock next mission
                const currentMissionIndex = MISSIONS.findIndex(m => m.id === id);
                if (currentMissionIndex !== -1 && currentMissionIndex < MISSIONS.length - 1) {
                    const nextMission = MISSIONS[currentMissionIndex + 1];
                    // Only unlock if it's currently LOCKED (don't overwrite if already completed/available)
                    if (!newStatuses[nextMission.id]) {
                        newStatuses[nextMission.id] = MissionStatus.AVAILABLE;
                    }
                }

                set({ missionStatuses: newStatuses });
            },

            unlockMission: (id) =>
                set((state) => ({
                    missionStatuses: {
                        ...state.missionStatuses,
                        [id]: MissionStatus.AVAILABLE
                    }
                })),

            resetProgress: () => set({ missionStatuses: INITIAL_STATUSES }),

            getMissionStatus: (id) => {
                return get().missionStatuses[id] || MissionStatus.LOCKED;
            },

            getAvailableMissions: () => {
                const statuses = get().missionStatuses;
                return Object.keys(statuses).filter(id =>
                    statuses[id] === MissionStatus.AVAILABLE ||
                    statuses[id] === MissionStatus.COMPLETED
                );
            },

            isMissionUnlocked: (id) => {
                const status = get().missionStatuses[id];
                return status === MissionStatus.AVAILABLE || status === MissionStatus.COMPLETED;
            }
        }),
        {
            name: 'space-math-mission-storage',
        }
    )
);
