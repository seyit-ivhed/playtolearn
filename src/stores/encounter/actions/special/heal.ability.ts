
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

    if (ability.target === 'ALL_ALLIES') {
        newParty = newParty.map(p => {
            if (p.isDead) return p;
            const newHealth = Math.min(p.maxHealth, p.currentHealth + ability.value);
            return { ...p, currentHealth: newHealth };
        });
        logs.push(`Healed party for ${ability.value}!`);
        set({ party: newParty });
    } else if (ability.target === 'SINGLE_ALLY') {
        // Heal the lowest health ally
        const lowestHealthIndex = newParty
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => !p.isDead)
            .sort((a, b) => a.p.currentHealth - b.p.currentHealth)[0]?.i;

        if (lowestHealthIndex !== undefined) {
            const target = newParty[lowestHealthIndex];
            const newHealth = Math.min(target.maxHealth, target.currentHealth + ability.value);
            newParty[lowestHealthIndex] = { ...target, currentHealth: newHealth };
            logs.push(`Healed ${target.name} for ${ability.value}!`);
            set({ party: newParty });
        }
    }
    return logs;
};
