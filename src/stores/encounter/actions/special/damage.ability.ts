import type { EncounterStore } from '../../interfaces';
import type { SpecialAbility } from '../../../../types/companion.types';
import { executeDamageAbility as executeDamageUtil } from '../../../../utils/battle/ability.utils';

export const executeDamageAbility = (
    get: () => EncounterStore,
    set: any,
    _unitId: string,
    ability: SpecialAbility
): string[] => {
    const { monsters } = get();
    const logs: string[] = [];

    const attacker = get().party.find(p => p.id === _unitId);
    const actualValue = attacker?.specialAbilityValue || ability.value;

    const newMonsters = executeDamageUtil(monsters, ability, actualValue);

    set({ monsters: newMonsters });

    if (ability.target === 'ALL_ENEMIES') {
        logs.push(`Dealt ${actualValue} damage to all enemies!`);
    } else {
        const target = monsters.find(m => !m.isDead);
        if (target) {
            logs.push(`Dealt ${actualValue} damage to ${target.name}!`);
        }
    }

    return logs;
};

