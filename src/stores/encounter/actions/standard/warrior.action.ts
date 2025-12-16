
import type { EncounterStore } from '../../interfaces';

export const performWarriorAction = (
    get: () => EncounterStore,
    set: any, // Using any for store set for now, or proper StateCreator type
    _partyIndex: number,
    companionData: any, // Using any to avoid circle deps for now or import Companion type
    multiplier: number
): string => {
    const { monsters } = get();
    // Hit first living monster
    const targetIndex = monsters.findIndex(m => !m.isDead);
    if (targetIndex !== -1) {
        const target = monsters[targetIndex];
        const baseDamage = companionData.stats.abilityDamage || 10;
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
