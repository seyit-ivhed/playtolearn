import { INITIAL_FELLOWSHIP, COMPANIONS } from '../../data/companions.data';
import type { GameState } from './interfaces';
import { IdentityService } from '../../services/identity.service';

export const initialGameState: GameState = {
    unlockedCompanions: [...INITIAL_FELLOWSHIP],
    activeParty: [...INITIAL_FELLOWSHIP], // Default full party
    deviceId: IdentityService.getDeviceId(),

    encounterResults: {},
    activeEncounterDifficulty: 1,

    xpPool: 0,
    companionStats: Object.keys(COMPANIONS).reduce((acc, id) => {
        acc[id] = { level: 1 };
        return acc;
    }, {} as Record<string, { level: number }>),
    restedCompanions: [],
    chronicle: {
        lastViewedVolumeId: 'origins',
        lastViewedAdventureId: 'prologue',
    },
    authMilestoneReached: false,
};

