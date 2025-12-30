/**
 * Ability Execution Utilities
 * Pure functions for executing special abilities (damage, heal, shield)
 */

import type { SpecialAbility } from '../../types/companion.types';
import type { EncounterUnit } from '../../types/encounter.types';
import { applyDamage, getTargetDamageMultiplier } from './damage.utils';

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
            const multiplier = getTargetDamageMultiplier(t);
            const actualDamage = Math.floor(abilityValue * multiplier);
            let result = applyDamage(t, actualDamage).unit;

            if (ability.id === 'hunters_mark') {
                result = applyMarked(result);
            }
            return result;
        });
    } else if (ability.target === 'SINGLE_ENEMY') {
        const targetIndex = targets.findIndex(t => !t.isDead);
        if (targetIndex === -1) return targets;

        const newTargets = [...targets];
        const target = targets[targetIndex];
        const multiplier = getTargetDamageMultiplier(target);
        const actualDamage = Math.floor(abilityValue * multiplier);

        let result = applyDamage(target, actualDamage).unit;

        if (ability.id === 'hunters_mark') {
            result = applyMarked(result);
        }

        newTargets[targetIndex] = result;
        return newTargets;
    }
    return targets;
}

function applyMarked(unit: EncounterUnit): EncounterUnit {
    const alreadyMarked = unit.statusEffects.some(se => se.id === 'marked');
    if (alreadyMarked) {
        return {
            ...unit,
            statusEffects: unit.statusEffects.map(se =>
                se.id === 'marked' ? { ...se, duration: 2 } : se
            )
        };
    }
    return {
        ...unit,
        statusEffects: [
            ...unit.statusEffects,
            { id: 'marked', type: 'DEBUFF', duration: 2 }
        ]
    };
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
            let updatedUnit = {
                ...t,
                currentHealth: Math.min(t.maxHealth, t.currentHealth + abilityValue)
            };

            // Apply Regeneration for Elixir of Renewal
            if (ability.id === 'elixir_of_renewal' && 'statusEffects' in updatedUnit) {
                const unitWithEffects = updatedUnit as unknown as EncounterUnit;
                const newEffects = [...unitWithEffects.statusEffects];

                // Refresh existing or add new
                const existingIdx = newEffects.findIndex(se => se.id === 'regeneration');
                if (existingIdx >= 0) {
                    newEffects[existingIdx] = { ...newEffects[existingIdx], duration: 2 };
                } else {
                    newEffects.push({ id: 'regeneration', type: 'BUFF', duration: 2 });
                }

                updatedUnit = {
                    ...updatedUnit,
                    statusEffects: newEffects
                };
            }

            return updatedUnit;
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
