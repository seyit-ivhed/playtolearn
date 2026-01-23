import type { EffectImplementation } from './types';
import { SHIELD } from './library';
import type { StatusEffectData } from '../../../types/encounter.types';

export const EffectRegistry: Record<string, EffectImplementation> = {
    'SHIELD': SHIELD
};

/**
 * Pipes damage through all active effects on a unit
 */
export const applyDamageModifiers = (damage: number, effects: StatusEffectData[] = []): number => {
    let finalDamage = damage;

    effects.forEach(effectData => {
        const implementation = EffectRegistry[effectData.type];
        if (implementation?.onDamageReceived) {
            finalDamage = implementation.onDamageReceived(finalDamage, effectData.state);
        }
    });

    return finalDamage;
};

/**
 * Ticks all effects and removes expired ones
 */
export const processEffectTick = (effects: StatusEffectData[] = []): StatusEffectData[] => {
    return effects
        .map(effectData => {
            const implementation = EffectRegistry[effectData.type];
            if (!implementation) return effectData;

            const newState = implementation.onTick ? implementation.onTick(effectData.state) : effectData.state;
            return {
                ...effectData,
                state: newState
            };
        })
        .filter(effectData => {
            const implementation = EffectRegistry[effectData.type];
            if (!implementation) return true;
            return !implementation.isExpired(effectData.state);
        });
};
