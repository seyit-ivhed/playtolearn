
import type { EncounterStore } from '../../interfaces';

export const performSupportAction = (
    get: () => EncounterStore,
    set: any,
    _partyIndex: number,
    companionData: any,
    multiplier: number
): string => {
    const { party } = get();
    // Heal lowest HP
    const baseAmount = companionData.stats.abilityHeal || 15;
    const amount = baseAmount * multiplier;

    const newParty = [...party];
    let lowestIndex = 0;
    let lowestHP = 9999;
    newParty.forEach((p, idx) => {
        if (!p.isDead && p.currentHealth < p.maxHealth && p.currentHealth < lowestHP) {
            lowestHP = p.currentHealth;
            lowestIndex = idx;
        }
    });

    const target = newParty[lowestIndex];
    if (target) {
        const newHealth = Math.min(target.maxHealth, target.currentHealth + amount);
        newParty[lowestIndex] = {
            ...target,
            currentHealth: newHealth
        };

        set({ party: newParty });
        return ` Healed ${target.name} for ${amount}.`;
    }
    return '';
};
