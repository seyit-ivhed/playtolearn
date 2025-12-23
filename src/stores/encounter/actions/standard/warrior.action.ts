
import type { EncounterStore } from '../../interfaces';
import { applyDamage } from '../../../../utils/battle/damage.utils';
import { findFirstLivingTarget } from '../../../../utils/battle/combat.utils';

export const performWarriorAction = (
    get: () => EncounterStore,
    set: any, // Using any for store set for now, or proper StateCreator type
    _partyIndex: number,
    multiplier: number
): string => {
    const { monsters, party } = get();
    const attacker = party[_partyIndex];

    // Hit first living monster
    const targetIndex = findFirstLivingTarget(monsters);
    if (targetIndex !== -1 && attacker) {
        const target = monsters[targetIndex];
        const baseDamage = attacker.damage || 10;
        const damage = baseDamage * multiplier;

        const result = applyDamage(target, damage);

        const newMonsters = [...monsters];
        newMonsters[targetIndex] = result.unit;

        set({ monsters: newMonsters });
        return ` Dealt ${damage} damage to ${target.name}.`;
    }
    return '';
};
