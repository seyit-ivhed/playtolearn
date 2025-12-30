import type { EncounterUnit } from '../../types/encounter.types';

/**
 * Combat Helper Utilities
 * General helper functions for combat mechanics
 */

/**
 * Get damage multiplier based on unit status effects
 */
export function getTargetDamageMultiplier(unit: EncounterUnit): number {
    if (!unit.statusEffects) return 1.0;
    const isMarked = unit.statusEffects.some(se => se.id === 'marked');
    return isMarked ? 1.25 : 1.0;
}

/**
 * Select random living target from array
 * 
 * @param targets - Array of units
 * @returns Index of random living target, or -1 if none found
 */
export function selectRandomTarget<T extends { isDead: boolean }>(
    targets: T[]
): number {
    const livingTargets = targets
        .map((t, i) => ({ t, i }))
        .filter(({ t }) => !t.isDead);

    if (livingTargets.length === 0) return -1;

    const randomIndex = Math.floor(Math.random() * livingTargets.length);
    return livingTargets[randomIndex].i;
}

