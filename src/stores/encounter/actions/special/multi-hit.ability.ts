
import type { EncounterStore } from '../../interfaces';

export const executeMultiHitAbility = (
    get: () => EncounterStore,
    set: any,
    _unitId: string,
    ability: any
): string[] => {
    const { monsters } = get();
    const newMonsters = [...monsters];
    const logs: string[] = [];

    let hits = ability.count || 3;
    for (let i = 0; i < hits; i++) {
        const livingMonsters = newMonsters.filter(m => !m.isDead);
        if (livingMonsters.length === 0) break;
        const randomIdx = Math.floor(Math.random() * livingMonsters.length);
        const targetId = livingMonsters[randomIdx].id;
        const monsterIdx = newMonsters.findIndex(m => m.id === targetId);

        if (monsterIdx !== -1) {
            const m = newMonsters[monsterIdx];
            const newHealth = Math.max(0, m.currentHealth - ability.value);
            newMonsters[monsterIdx] = { ...m, currentHealth: newHealth, isDead: newHealth === 0 };
        }
    }
    logs.push(`Dealt ${ability.value} damage x${hits}!`);
    set({ monsters: newMonsters });
    return logs;
};
