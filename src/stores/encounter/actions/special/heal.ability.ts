import type { EncounterStore } from '../../interfaces';
import type { SpecialAbility } from '../../../../types/companion.types';
import { executeHealAbility as executeHealUtil } from '../../../../utils/battle/ability.utils';

export const executeHealAbility = (
    get: () => EncounterStore,
    set: any,
    _unitId: string,
    ability: SpecialAbility
): string[] => {
    const { party } = get();
    const logs: string[] = [];

    const attacker = get().party.find(p => p.id === _unitId);
    const healAmount = attacker?.specialAbilityValue || ability.value;

    const newParty = executeHealUtil(party, ability, healAmount);

    set({ party: newParty });

    if (ability.target === 'ALL_ALLIES') {
        logs.push(`Healed all allies for ${healAmount} HP!`);
    } else if (ability.target === 'SINGLE_ALLY') {
        const lowestHealthAlly = party
            .filter(p => !p.isDead)
            .sort((a, b) => a.currentHealth - b.currentHealth)[0];
        if (lowestHealthAlly) {
            logs.push(`Healed ${lowestHealthAlly.name} for ${healAmount} HP!`);
        }
    }
    return logs;
};

