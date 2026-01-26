import { type AbilityImplementation, type AbilityResult } from './types';

import { applyDamageEffect } from './helpers';

// Amara: Jaguar Strike - Single Target Damage
export const jaguar_strike: AbilityImplementation = ({ allUnits, variables }): AbilityResult => {
    const damage = variables.damage || 0;
    return applyDamageEffect(allUnits, 'SINGLE_ENEMY', damage);
};

// Tariq: Elixir of Life - All Allies Heal
export const elixir_of_life: AbilityImplementation = ({ allUnits, variables }): AbilityResult => {
    const heal = variables.heal || 0;
    const allies = allUnits.filter(u => u.isPlayer && !u.isDead);

    // Always target ALL living allies
    const targets = allies;

    const updatedUnits = allUnits.map(u => {
        const isTarget = targets.some(t => t.id === u.id);
        if (isTarget) {
            const healedAmount = Math.min(u.maxHealth - u.currentHealth, heal);
            if (healedAmount > 0) {
                return {
                    ...u,
                    currentHealth: u.currentHealth + healedAmount
                };
            }
        }
        return u;
    });

    return {
        updatedUnits
    };
};

// Kenji: Blade Barrier - Shield/Protect
export const blade_barrier: AbilityImplementation = ({ allUnits, variables }): AbilityResult => {
    const damage = variables.damage || 0;
    const duration = variables.duration || 2;
    const reduction = variables.reduction || 50;

    let updatedUnits = allUnits;

    // 1. Single target damage to first enemy
    if (damage > 0) {
        const damageResult = applyDamageEffect(updatedUnits, 'SINGLE_ENEMY', damage);
        updatedUnits = damageResult.updatedUnits;
    }

    // 2. Apply shield to all living companions
    updatedUnits = updatedUnits.map(unit => {
        if (unit.isPlayer && !unit.isDead) {
            const existingEffects = unit.statusEffects || [];

            // Remove existing SHIELD if any (refreshing)
            const otherEffects = existingEffects.filter(e => e.type !== 'SHIELD');

            const shieldEffect = {
                id: `shield_${unit.id}_${Date.now()}`,
                type: 'SHIELD',
                state: { duration, reduction }
            };

            return {
                ...unit,
                statusEffects: [...otherEffects, shieldEffect]
            };
        }
        return unit;
    });

    return { updatedUnits };
};

// Zahara: Ancestral Storm - All Enemies Damage
export const ancestral_storm: AbilityImplementation = ({ allUnits, variables }): AbilityResult => {
    const damage = variables.damage || 0;
    return applyDamageEffect(allUnits, 'ALL_ENEMIES', damage);
};
