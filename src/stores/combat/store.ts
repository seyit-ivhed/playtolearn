import { create } from 'zustand';
import type { CombatStore } from './interfaces';
import { initialCombatState } from './initial-state';
import { createCombatFlowSlice } from './slices/combat-flow.slice';
import { createPlayerActionsSlice } from './slices/player-actions.slice';

export const useCombatStore = create<CombatStore>((...a) => ({
    ...initialCombatState,
    ...createCombatFlowSlice(...a),
    ...createPlayerActionsSlice(...a),
}));

// Expose store for testing
if (typeof window !== 'undefined') {
    (window as any).useCombatStore = useCombatStore;
}
