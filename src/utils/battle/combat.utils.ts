/**
 * Combat Helper Utilities
 * General helper functions for combat mechanics
 */

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

/**
 * Find first living target
 * 
 * @param targets - Array of units
 * @returns Index of first living target, or -1 if none found
 */
export function findFirstLivingTarget<T extends { isDead: boolean }>(
    targets: T[]
): number {
    return targets.findIndex(t => !t.isDead);
}
