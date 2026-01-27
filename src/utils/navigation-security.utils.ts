import { ADVENTURES } from '../data/adventures.data';
import { EncounterType } from '../types/adventure.types';
import type { EncounterResult } from '../stores/game/interfaces';

type NavigationAccessReason = 'PREMIUM_LOCKED' | 'ADVENTURE_LOCKED' | 'NODE_LOCKED' | 'INVALID_ADVENTURE';

interface NavigationAccessParams {
    adventureId: string;
    nodeIndex?: number; // 1-indexed
    isPremiumUnlocked: (id: string) => boolean;
    isProgressionUnlocked: (id: string) => boolean;
    encounterResults: Record<string, EncounterResult>;
}

export const checkNavigationAccess = ({
    adventureId,
    nodeIndex,
    isPremiumUnlocked,
    isProgressionUnlocked,
    encounterResults
}: NavigationAccessParams): { allowed: boolean; reason?: NavigationAccessReason } => {
    // 1. Basic Adventure Existence
    const adventure = ADVENTURES.find(a => a.id === adventureId);
    if (!adventure) return { allowed: false, reason: 'INVALID_ADVENTURE' };

    // 2. Premium/Free Gate
    if (!isPremiumUnlocked(adventureId)) {
        return { allowed: false, reason: 'PREMIUM_LOCKED' };
    }

    // 3. Adventure Progression Gate (Unlocked via previous adventure completion)
    if (!isProgressionUnlocked(adventureId)) {
        return { allowed: false, reason: 'ADVENTURE_LOCKED' };
    }

    // 4. Node linear progression check (if nodeIndex provided)
    if (nodeIndex !== undefined) {
        // Validation: Ensure nodeIndex is within range
        if (nodeIndex < 1 || nodeIndex > adventure.encounters.length) {
            return { allowed: false, reason: 'NODE_LOCKED' };
        }

        // Check all gating encounters before nodeIndex
        for (let i = 0; i < nodeIndex - 1; i++) {
            const encounter = adventure.encounters[i];

            if (
                encounter.type === EncounterType.BATTLE ||
                encounter.type === EncounterType.BOSS ||
                encounter.type === EncounterType.PUZZLE
            ) {
                const encounterKey = `${adventureId}_${i + 1}`;
                const result = encounterResults[encounterKey];
                if (!result || result.stars < 1) {
                    return { allowed: false, reason: 'NODE_LOCKED' };
                }
            }
        }
    }

    return { allowed: true };
};
