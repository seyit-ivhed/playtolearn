import { INITIAL_FELLOWSHIP, COMPANIONS } from '../../data/companions.data';
import type { GameState } from './interfaces';

export const initialGameState: GameState = {
    activeParty: [...INITIAL_FELLOWSHIP],
    encounterResults: {},
    activeEncounterDifficulty: 1,
    companionStats: Object.keys(COMPANIONS).reduce((acc, id) => {
        acc[id] = { level: 1 };
        return acc;
    }, {} as Record<string, { level: number }>),
    adventureStatuses: {}
};

