/**
 * Ability Execution Utilities
 * Pure functions for executing special abilities (damage, heal)
 */

import type { SpecialAbility } from '../../types/companion.types';
import type { EncounterUnit } from '../../types/encounter.types';
import { applyDamage } from './damage.utils';

export interface HealableUnit {
    currentHealth: number;
    maxHealth: number;
    isDead: boolean;
}

/**
 * Execute damage ability on targets
 * 
 * @param targets - Array of unit instances
 * @param ability - The special ability being executed
 * @param abilityValue - The base damage value to apply
 * @returns Updated array of targets
 */
export function executeDamageAbility(
    targets: EncounterUnit[],
    ability: SpecialAbility,
    abilityValue: number
): EncounterUnit[] {
    if (ability.target === 'ALL_ENEMIES') {
        return targets.map(t => {
            if (t.isDead) return t;
            return applyDamage(t, abilityValue).unit;
        });
    } else if (ability.target === 'SINGLE_ENEMY') {
        const targetIndex = targets.findIndex(t => !t.isDead);
        if (targetIndex === -1) return targets;

        const newTargets = [...targets];
        const target = targets[targetIndex];

        const result = applyDamage(target, abilityValue).unit;

        newTargets[targetIndex] = result;
        return newTargets;
    }
    return targets;
}



/**
 * Execute heal ability on targets
 * 
 * @param targets - Array of ally units
 * @param ability - The special ability being executed
 * @param abilityValue - The heal value to apply
 * @returns Updated array of targets
 */
export function executeHealAbility<T extends HealableUnit>(
    targets: T[],
    ability: SpecialAbility,
    abilityValue: number
): T[] {
    if (ability.target === 'ALL_ALLIES') {
        return targets.map(t => {
            if (t.isDead) return t;

            // Base Heal
            return {
                ...t,
                currentHealth: Math.min(t.maxHealth, t.currentHealth + abilityValue)
            };
        });
    } else if (ability.target === 'SINGLE_ALLY') {
        // Heal lowest health ally
        const lowestHealthIndex = targets
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => !t.isDead)
            .sort((a, b) => a.t.currentHealth - b.t.currentHealth)[0]?.i;

        if (lowestHealthIndex === undefined) return targets;

        const newTargets = [...targets];
        let target = targets[lowestHealthIndex];

        target = {
            ...target,
            currentHealth: Math.min(target.maxHealth, target.currentHealth + abilityValue)
        };

        newTargets[lowestHealthIndex] = target;
        return newTargets;
    }
    return targets;
}
