import { type AbilityImplementation, type AbilityResult } from './types';
import type { CombatLog } from '../../../types/encounter.types';
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
        updatedUnits,
        logs: [{ message: `Healed allies for ${heal}`, type: 'EFFECT' }]
    };
};

// Kenji: Blade Barrier - Shield/Protect (Currently mapped to Damage/Shield in dummy logic)
// Plan said Kenji uses SHIELD, this is a temp implementation.
export const blade_barrier: AbilityImplementation = ({ allUnits, variables }): AbilityResult => {
    const damage = variables.damage || 0;

    let updatedUnits = allUnits;
    const logs: CombatLog[] = [];

    if (damage > 0) {
        const damageResult = applyDamageEffect(updatedUnits, 'SINGLE_ENEMY', damage);
        updatedUnits = damageResult.updatedUnits;
        logs.push(...damageResult.logs);
    }

    return { updatedUnits, logs };
};

// Zahara: Ancestral Storm - All Enemies Damage
export const ancestral_storm: AbilityImplementation = ({ allUnits, variables }): AbilityResult => {
    const damage = variables.damage || 0;
    return applyDamageEffect(allUnits, 'ALL_ENEMIES', damage);
};
