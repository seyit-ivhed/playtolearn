
import type { EncounterStore } from '../../interfaces';

export const executeShieldAbility = (
    get: () => EncounterStore,
    set: any,
    _unitId: string,
    ability: any
): string[] => {
    const { party } = get();
    let newParty = [...party];
    const logs: string[] = [];

    if (ability.target === 'ALL_ALLIES') {
        newParty = newParty.map(p => {
            if (p.isDead) return p;
            return { ...p, currentShield: p.currentShield + ability.value };
        });
        logs.push(`Shielded party for ${ability.value}!`);
        set({ party: newParty });
    }
    return logs;
};
