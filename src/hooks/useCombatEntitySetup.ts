import { useShipStore } from '../stores/ship.store';
import type { CombatEntity } from '../types/combat.types';
import type { Mission } from '../types/mission.types';
import { createPlayerCombatEntity, createEnemyCombatEntity } from '../utils/combat-entity-factory';

export function useCombatEntitySetup() {
    const { loadout, getTotalStats } = useShipStore();

    const createCombatEntities = (mission: Mission): { playerStats: CombatEntity; enemyStats: CombatEntity } => {
        const shipStats = getTotalStats();

        // Create player entity from actual ship loadout
        const playerStats = createPlayerCombatEntity(loadout, shipStats);

        // Create enemy entity with default setup
        const enemyStats: CombatEntity = {
            id: mission.enemy.id,
            name: mission.enemy.name,
            sprite: mission.enemy.sprite,
            maxHealth: mission.enemy.maxHealth,
            currentHealth: mission.enemy.maxHealth,
            maxShield: mission.enemy.maxShield || 0,
            currentShield: mission.enemy.maxShield || 0,
            equippedModules: [], // Enemies don't use dynamic modules yet
            modules: {
                attack: { currentEnergy: 0, maxEnergy: 0 },
                defend: { currentEnergy: 0, maxEnergy: 0 },
                special: { currentEnergy: 0, maxEnergy: 0 },
            },
        };

        return { playerStats, enemyStats };
    };

    return { createCombatEntities };
}
