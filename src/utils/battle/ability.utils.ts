/**
 * Ability Execution Utilities
 * Pure functions for executing special abilities (damage, heal, shield)
 */

import type { SpecialAbility } from '../../types/companion.types';
import { applyDamage, type DamageableUnit } from './damage.utils';

export interface HealableUnit {
    currentHealth: number;
    maxHealth: number;
    isDead: boolean;
}

export interface ShieldableUnit {
    currentShield: number;
    isDead: boolean;
}

/**
 * Execute damage ability on targets
 * 
 * @param targets - Array of enemy units
 * @param ability - The special ability being executed
 * @param abilityValue - The damage value to apply
 * @returns Updated array of targets
 */
export function executeDamageAbility<T extends DamageableUnit>(
    targets: T[],
    ability: SpecialAbility,
    abilityValue: number
): T[] {
    if (ability.target === 'ALL_ENEMIES') {
        return targets.map(t => {
            if (t.isDead) return t;
            return applyDamage(t, abilityValue).unit;
        });
    } else if (ability.target === 'SINGLE_ENEMY') {
        const targetIndex = targets.findIndex(t => !t.isDead);
        if (targetIndex === -1) return targets;

        const newTargets = [...targets];
        newTargets[targetIndex] = applyDamage(targets[targetIndex], abilityValue).unit;
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
        const target = targets[lowestHealthIndex];
        newTargets[lowestHealthIndex] = {
            ...target,
            currentHealth: Math.min(target.maxHealth, target.currentHealth + abilityValue)
        };
        return newTargets;
    }
    return targets;
}

/**
 * Execute shield ability on targets
 * 
 * @param targets - Array of ally units
 * @param ability - The special ability being executed
 * @param abilityValue - The shield value to apply
 * @returns Updated array of targets
 */
export function executeShieldAbility<T extends ShieldableUnit>(
    targets: T[],
    ability: SpecialAbility,
    abilityValue: number
): T[] {
    if (ability.target === 'ALL_ALLIES') {
        return targets.map(t => {
            if (t.isDead) return t;
            return {
                ...t,
                currentShield: t.currentShield + abilityValue
            };
        });
    }
    return targets;
}
