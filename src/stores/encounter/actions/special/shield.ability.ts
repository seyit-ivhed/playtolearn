import type { EncounterStore } from '../../interfaces';
import type { SpecialAbility } from '../../../../types/companion.types';
import { executeShieldAbility as executeShieldUtil } from '../../../../utils/battle/ability.utils';

export const executeShieldAbility = (
    get: () => EncounterStore,
    set: (state: Partial<EncounterStore>) => void,
    _unitId: string,
    ability: SpecialAbility
): string[] => {
    const { party } = get();
    const logs: string[] = [];

    const attacker = get().party.find(p => p.id === _unitId);
    const shieldAmount = attacker?.specialAbilityValue || ability.value;

    const newParty = executeShieldUtil(party, ability, shieldAmount);

    set({ party: newParty });

    if (ability.target === 'ALL_ALLIES') {
        logs.push(`Granted ${shieldAmount} shield to all allies!`);
    }
    return logs;
};

