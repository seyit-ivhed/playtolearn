import type { StatusEffectData } from '../../../types/encounter.types';

export type StatusEffectState = StatusEffectData['state'];

export interface EffectImplementation {
    onDamageReceived?: (damage: number, state: StatusEffectData['state']) => number;
    onDamageDealt?: (damage: number, state: StatusEffectData['state']) => number;
    onTick?: (state: StatusEffectData['state']) => StatusEffectData['state'];
    isExpired: (state: StatusEffectData['state']) => boolean;
}
