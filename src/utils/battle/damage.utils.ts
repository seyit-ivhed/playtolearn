/**
 * Damage Calculation Utilities
 * Pure functions for applying damage
 */

export interface DamageableUnit {
    currentHealth: number;
    isDead: boolean;
}

export interface DamageResult<T extends DamageableUnit> {
    unit: T;
    damageDealt: number;
}

/**
 * Apply damage to a unit
 * 
 * @param unit - The unit to damage
 * @param damageAmount - Amount of damage to apply
 * @returns Updated unit and damage breakdown
 */
export function applyDamage<T extends DamageableUnit>(
    unit: T,
    damageAmount: number
): DamageResult<T> {
    let healthDamage = 0;

    // Then reduce health
    healthDamage = Math.min(damageAmount, unit.currentHealth);
    const newHealth = Math.max(0, unit.currentHealth - damageAmount);

    return {
        unit: {
            ...unit,
            currentHealth: newHealth,
            isDead: newHealth === 0
        },
        damageDealt: healthDamage
    };
}
