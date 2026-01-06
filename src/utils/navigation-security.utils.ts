import { ADVENTURES } from '../data/adventures.data';
import { EncounterType } from '../types/adventure.types';
import type { EncounterResult } from '../stores/game/interfaces';

export type NavigationAccessReason = 'PREMIUM_LOCKED' | 'ADVENTURE_LOCKED' | 'NODE_LOCKED' | 'INVALID_ADVENTURE';

export interface NavigationAccessParams {
    adventureId: string;
    nodeIndex?: number; // 1-indexed
    isPremiumUnlocked: (id: string) => boolean;
    isProgressionUnlocked: (id: string) => boolean;
    encounterResults: Record<string, EncounterResult>;
}

/**
 * Centrally validates if a player can access a specific adventure or a specific node within it.
 * 
 * Rules:
 * 1. Adventure must exist in ADVENTURES data.
 * 2. Player must have premium access (or it must be a free chapter like Prologue/Ady 1).
 * 3. Player must have unlocked the adventure through progression.
 * 4. If nodeIndex is provided, all previous gating encounters (Battle, Boss, Puzzle, Camp) must be completed.
 */
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

            // These types act as progress milestones that must be cleared
            if (
                encounter.type === EncounterType.BATTLE ||
                encounter.type === EncounterType.BOSS ||
                encounter.type === EncounterType.PUZZLE
            ) {
                const encounterKey = `${adventureId}_${i + 1}`;
                if (!encounterResults[encounterKey]) {
                    return { allowed: false, reason: 'NODE_LOCKED' };
                }
            }
        }
    }

    return { allowed: true };
};
