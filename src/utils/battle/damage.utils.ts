/**
 * Damage Calculation Utilities
 * Pure functions for applying damage with shield handling
 */

export interface DamageableUnit {
    currentHealth: number;
    currentShield: number;
    isDead: boolean;
}

export interface DamageResult<T extends DamageableUnit> {
    unit: T;
    damageDealt: number;
    shieldDamage: number;
    healthDamage: number;
}

// ... (existing imports if any)

export interface UnitWithStatusEffects {
    statusEffects?: { id: string; duration: number; type?: string }[];
}

/**
 * Apply damage to a unit, handling shield absorption
 * 
 * @param unit - The unit to damage
 * @param damageAmount - Amount of damage to apply
 * @returns Updated unit and damage breakdown
 */
export function applyDamage<T extends DamageableUnit>(
    unit: T,
    damageAmount: number
): DamageResult<T> {
    let remainingDamage = damageAmount;
    let shieldDamage = 0;
    let healthDamage = 0;

    // First reduce shield
    if (unit.currentShield > 0) {
        if (unit.currentShield >= remainingDamage) {
            shieldDamage = remainingDamage;
            remainingDamage = 0;
        } else {
            shieldDamage = unit.currentShield;
            remainingDamage -= unit.currentShield;
        }
    }

    // Then reduce health
    healthDamage = Math.min(remainingDamage, unit.currentHealth);
    const newHealth = Math.max(0, unit.currentHealth - remainingDamage);

    return {
        unit: {
            ...unit,
            currentHealth: newHealth,
            currentShield: unit.currentShield - shieldDamage,
            isDead: newHealth === 0
        },
        damageDealt: shieldDamage + healthDamage,
        shieldDamage,
        healthDamage
    };
}

/**
 * Get damage multiplier based on unit status effects
 * Move here to avoid circular dependency between ability.utils and combat-engine
 */
export function getTargetDamageMultiplier(unit: UnitWithStatusEffects): number {
    if (!unit.statusEffects) return 1.0;
    const isMarked = unit.statusEffects.some(se => se.id === 'marked');
    return isMarked ? 1.25 : 1.0;
}
