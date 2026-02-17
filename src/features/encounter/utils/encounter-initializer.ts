import { ADVENTURES } from '../../../data/adventures.data';
import { EncounterType, type AdventureMonster } from '../../../types/adventure.types';

export interface BattleEncounterData {
    activeParty: string[];
    localizedEnemies: AdventureMonster[];
    nodeIndex: number;
    difficulty: number;
    companionStats: Record<string, { level: number }>;
}

export function buildBattleEncounterData(
    adventureId: string,
    nodeIndex: number,
    activeParty: string[],
    companionStats: Record<string, { level: number }>,
    difficulty: number,
    t: (key: string, options?: { defaultValue: string }) => string
): BattleEncounterData | null {
    const adventure = ADVENTURES.find(a => a.id === adventureId);
    const encounter = adventure?.encounters[nodeIndex - 1];

    if (!encounter) {
        console.error(`Encounter not found for adventure ${adventureId} at node ${nodeIndex}`);
        return null;
    }

    if (encounter.type !== EncounterType.BATTLE && encounter.type !== EncounterType.BOSS) {
        return null;
    }

    if (!encounter.enemies || encounter.enemies.length === 0) {
        console.error(`No enemies defined for battle encounter ${encounter.id}`);
        return null;
    }

    const localizedEnemies = encounter.enemies.map((enemy: AdventureMonster) => ({
        ...enemy,
        name: t(`monsters.${enemy.id}.name`, { defaultValue: enemy.name || enemy.id })
    }));

    return { activeParty, localizedEnemies, nodeIndex, difficulty, companionStats };
}
