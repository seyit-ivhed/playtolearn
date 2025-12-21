
import type { EncounterStore } from '../../interfaces';

export const performWarriorAction = (
    get: () => EncounterStore,
    set: any, // Using any for store set for now, or proper StateCreator type
    _partyIndex: number,
    multiplier: number
): string => {
    const { monsters, party } = get();
    const attacker = party[_partyIndex];
    // Hit first living monster
    const targetIndex = monsters.findIndex(m => !m.isDead);
    if (targetIndex !== -1 && attacker) {
        const target = monsters[targetIndex];
        const baseDamage = attacker.damage || 10;
        const damage = baseDamage * multiplier;

        const newHealth = Math.max(0, target.currentHealth - damage);

        const newMonsters = [...monsters];
        newMonsters[targetIndex] = {
            ...target,
            currentHealth: newHealth,
            isDead: newHealth === 0
        };

        set({ monsters: newMonsters });
        return ` Dealt ${damage} damage to ${target.name}.`;
    }
    return '';
};
