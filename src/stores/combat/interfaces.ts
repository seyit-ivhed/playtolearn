import type { CombatState } from '../../types/combat.types';
import type { AdventureMonster } from '../../types/adventure.types';

export interface CombatFlowSlice {
    initializeCombat: (partyIds: string[], enemies: AdventureMonster[]) => void;
    endPlayerTurn: () => void;
    processMonsterTurn: () => void;
}

export interface PlayerActionsSlice {
    selectUnit: (unitId: string | null) => void;
    performAction: (unitId: string, options?: { isCritical?: boolean }) => void;
    resolveSpecialAttack: (unitId: string, success: boolean) => void;
}

export interface CombatStore extends CombatState, CombatFlowSlice, PlayerActionsSlice { }
