import { INITIAL_FELLOWSHIP, COMPANIONS } from '../../data/companions.data';
import type { GameState } from './interfaces';

export const initialGameState: GameState = {
    currentMapNode: 1,
    activeAdventureId: '1',
    unlockedCompanions: [...INITIAL_FELLOWSHIP],
    activeParty: [...INITIAL_FELLOWSHIP], // Default full party

    encounterResults: {},
    activeEncounterDifficulty: 1,

    xpPool: 0,
    companionStats: Object.keys(COMPANIONS).reduce((acc, id) => {
        acc[id] = { level: 1, xp: 0 };
        return acc;
    }, {} as Record<string, { level: number; xp: number }>),
    restedCompanions: [],
};
