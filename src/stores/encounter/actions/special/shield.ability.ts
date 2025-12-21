
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

    const attacker = get().party.find(p => p.id === _unitId);
    const actualValue = attacker?.specialAbilityValue || ability.value;

    if (ability.target === 'ALL_ALLIES') {
        newParty = newParty.map(p => {
            if (p.isDead) return p;
            return { ...p, currentShield: p.currentShield + actualValue };
        });
        logs.push(`Shielded party for ${actualValue}!`);
        set({ party: newParty });
    }
    return logs;
};
