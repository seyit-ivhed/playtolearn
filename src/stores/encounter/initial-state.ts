import { EncounterPhase, type EncounterState } from '../../types/encounter.types';

export const initialEncounterState: EncounterState = {
    phase: EncounterPhase.INIT,
    turnCount: 0,
    party: [],
    monsters: [],
    selectedUnitId: null,
    encounterLog: [],
    xpReward: 0,
};
