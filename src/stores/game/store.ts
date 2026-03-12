import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameStore } from './interfaces';
import { initialGameState } from './initial-state';
import { createAdventureProgressSlice } from './slices/adventure-progress.slice';
import { createAdventureStatusSlice } from './slices/adventure-status.slice';
import { createProgressionSlice } from './slices/progression.slice';
import { createDebugSlice } from './slices/debug.slice';
import { GAME_STORE_KEY } from '../storage-keys';

export const useGameStore = create<GameStore>()(
    persist(
        (...a) => ({
            ...initialGameState,
            ...createAdventureProgressSlice(...a),
            ...createAdventureStatusSlice(...a),
            ...createProgressionSlice(...a),
            ...createDebugSlice(...a),
        }),
        {
            name: GAME_STORE_KEY,
        }
    )
);

// Re-export types for convenience
export type { EncounterResult, GameStore } from './interfaces';

export const selectCompletedEncountersCount = (state: GameStore) => Object.keys(state.encounterResults).length;
