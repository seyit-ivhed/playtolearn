import { create } from 'zustand';
import type { EncounterStore } from './interfaces';
import { initialEncounterState } from './initial-state';
import { createEncounterFlowSlice } from './slices/encounter-flow.slice';
import { createPlayerActionsSlice } from './slices/player-actions.slice';

export const useEncounterStore = create<EncounterStore>((...a) => ({
    ...initialEncounterState,
    ...createEncounterFlowSlice(...a),
    ...createPlayerActionsSlice(...a),
}));

declare global {
    interface Window {
        useEncounterStore: typeof useEncounterStore;
    }
}

// Expose store for testing
if (typeof window !== 'undefined') {
    window.useEncounterStore = useEncounterStore;
}
