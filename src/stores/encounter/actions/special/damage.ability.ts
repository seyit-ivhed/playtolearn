
import type { EncounterStore } from '../../interfaces';

export const executeDamageAbility = (
    get: () => EncounterStore,
    set: any,
    _unitId: string,
    ability: any
): string[] => {
    const { monsters } = get();
    let newMonsters = [...monsters];
    const logs: string[] = [];

    if (ability.target === 'ALL_ENEMIES') {
        newMonsters = newMonsters.map(m => {
            if (m.isDead) return m;
            const newHealth = Math.max(0, m.currentHealth - ability.value);
            return { ...m, currentHealth: newHealth, isDead: newHealth === 0 };
        });
        logs.push(`Dealt ${ability.value} damage to ALL enemies!`);
        set({ monsters: newMonsters });
    } else if (ability.target === 'SINGLE_ENEMY') {
        // Hit first living
        const targetIndex = newMonsters.findIndex(m => !m.isDead);
        if (targetIndex !== -1) {
            const target = newMonsters[targetIndex];
            const newHealth = Math.max(0, target.currentHealth - ability.value);
            newMonsters[targetIndex] = { ...target, currentHealth: newHealth, isDead: newHealth === 0 };
            logs.push(`Dealt ${ability.value} damage to ${target.name}!`);
            set({ monsters: newMonsters });
        }
    }
    return logs;
};
