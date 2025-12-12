import { CombatPhase, type CombatState } from '../../types/combat.types';

export const initialCombatState: CombatState = {
    phase: CombatPhase.INIT,
    turnCount: 0,
    party: [],
    monsters: [],
    selectedUnitId: null,
    combatLog: [],
};
