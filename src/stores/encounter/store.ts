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

// Expose store for testing
if (typeof window !== 'undefined') {
    (window as any).useEncounterStore = useEncounterStore;
}
