
import type { EncounterStore } from '../../interfaces';

export const executeHealAbility = (
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
            const newHealth = Math.min(p.maxHealth, p.currentHealth + actualValue);
            return { ...p, currentHealth: newHealth };
        });
        logs.push(`Healed party for ${actualValue}!`);
        set({ party: newParty });
    } else if (ability.target === 'SINGLE_ALLY') {
        // Heal the lowest health ally
        const lowestHealthIndex = newParty
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => !p.isDead)
            .sort((a, b) => a.p.currentHealth - b.p.currentHealth)[0]?.i;

        if (lowestHealthIndex !== undefined) {
            const target = newParty[lowestHealthIndex];
            const newHealth = Math.min(target.maxHealth, target.currentHealth + actualValue);
            newParty[lowestHealthIndex] = { ...target, currentHealth: newHealth };
            logs.push(`Healed ${target.name} for ${actualValue}!`);
            set({ party: newParty });
        }
    }
    return logs;
};
