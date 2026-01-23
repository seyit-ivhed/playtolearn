import { applyDamageModifiers } from '../../features/encounter/effects/registry';
import { type StatusEffectData } from '../../types/encounter.types';

export interface DamageableUnit {
    currentHealth: number;
    isDead: boolean;
    statusEffects?: StatusEffectData[];
}

export interface DamageResult<T extends DamageableUnit> {
    unit: T;
    damageDealt: number;
}

export function applyDamage<T extends DamageableUnit>(
    unit: T,
    damageAmount: number
): DamageResult<T> {
    // Apply status effect modifiers first
    const finalDamageAmount = applyDamageModifiers(damageAmount, unit.statusEffects);

    // Then reduce health
    const healthDamage = Math.min(finalDamageAmount, unit.currentHealth);
    const newHealth = Math.max(0, unit.currentHealth - finalDamageAmount);

    return {
        unit: {
            ...unit,
            currentHealth: newHealth,
            isDead: newHealth === 0
        },
        damageDealt: healthDamage
    };
}
