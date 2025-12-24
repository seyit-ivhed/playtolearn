import type { EncounterState } from '../../types/encounter.types';
import type { AdventureMonster } from '../../types/adventure.types';

export interface EncounterFlowSlice {
    initializeEncounter: (partyIds: string[], enemies: AdventureMonster[], xpReward: number, nodeIndex: number, companionStats: Record<string, { level: number; xp: number }>) => void;
    endPlayerTurn: () => void;
    processMonsterTurn: () => void;
}

export interface PlayerActionsSlice {
    selectUnit: (unitId: string | null) => void;
    performAction: (unitId: string) => void;
    resolveSpecialAttack: (unitId: string, success: boolean) => void;
    consumeSpirit: (unitId: string) => void;
}

export interface EncounterStore extends EncounterState, EncounterFlowSlice, PlayerActionsSlice { }
