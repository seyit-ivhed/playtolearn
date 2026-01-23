import type { EffectImplementation } from './types';

export const SHIELD: EffectImplementation = {
    onDamageReceived: (damage, state) => {
        const reduction = (state.reduction as number) || 50;
        const multiplier = (100 - reduction) / 100;
        return Math.floor(damage * multiplier);
    },
    onTick: (state) => {
        const duration = (state.duration as number) || 0;
        return {
            ...state,
            duration: duration - 1
        };
    },
    isExpired: (state) => {
        return (state.duration as number) <= 0;
    }
};
