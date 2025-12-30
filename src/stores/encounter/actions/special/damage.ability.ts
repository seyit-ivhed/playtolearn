import type { EncounterStore } from '../../interfaces';
import type { SpecialAbility } from '../../../../types/companion.types';
import { executeDamageAbility as executeDamageUtil } from '../../../../utils/battle/ability.utils';
import { getTargetDamageMultiplier } from '../../../../utils/battle/combat.utils';

export const executeDamageAbility = (
    get: () => EncounterStore,
    set: (state: Partial<EncounterStore>) => void,
    _unitId: string,
    ability: SpecialAbility
): string[] => {
    const { monsters } = get();
    const logs: string[] = [];

    const attacker = get().party.find(p => p.id === _unitId);
    const baseValue = attacker?.specialAbilityValue || ability.value;

    const newMonsters = executeDamageUtil(monsters, ability, baseValue);

    set({ monsters: newMonsters });

    if (ability.target === 'ALL_ENEMIES') {
        logs.push(`Dealt damage to all enemies!`);
    } else {
        const targetIndex = monsters.findIndex(m => !m.isDead);
        if (targetIndex !== -1) {
            const target = monsters[targetIndex];
            const multiplier = getTargetDamageMultiplier(target);
            const actualDamage = Math.floor(baseValue * multiplier);
            const markText = ability.id === 'hunters_mark' ? ' and marked them' : '';
            logs.push(`Dealt ${actualDamage} damage to ${target.name}${markText}!`);
        }
    }

    return logs;
};
