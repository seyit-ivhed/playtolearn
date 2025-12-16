
import type { EncounterStore } from '../../interfaces';

export const executeHealAbility = (
    get: () => EncounterStore,
    set: any,
    unitId: string,
    ability: any
): string[] => {
    const { party } = get();
    let newParty = [...party];
    const logs: string[] = [];
    const unitIndex = party.findIndex(u => u.id === unitId);
    if (unitIndex === -1) return logs;
    const unit = party[unitIndex];

    if (ability.target === 'ALL_ALLIES') {
        newParty = newParty.map(p => {
            if (p.isDead) return p;
            return { ...p, currentHealth: Math.min(p.maxHealth, p.currentHealth + ability.value) };
        });
        logs.push(`Healed party for ${ability.value}!`);
        set({ party: newParty });
    } else if (ability.target === 'SELF') {
        // Logic for Squire (Heal Self + Max Shield) - Note: Original code handled logic for Squire specifically here.
        // If we want to be generic, 'SELF' heal should just be heal. But the original code coupled Shield Wall with Self Heal.
        // For now I will replicate original logic but we might want to decouple later.
        const newHealth = Math.min(unit.maxHealth, unit.currentHealth + ability.value);
        newParty[unitIndex] = {
            ...newParty[unitIndex],
            currentHealth: newHealth,
            // Original code set shield to 999. I will keep this side effect here as it seems intentional for the "Self" target ability implementation so far.
            // Ideally this should be property of ability config, e.g. secondaryEffect: 'MAX_SHIELD'
            currentShield: 999
        };
        logs.push(`Healed self and raised Shield Wall!`);
        set({ party: newParty });
    }
    return logs;
};
