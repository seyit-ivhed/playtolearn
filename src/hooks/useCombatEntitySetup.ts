import { usePartyStore } from '../stores/party.store';
import type { CombatEntity } from '../types/combat.types';
import type { Mission } from '../types/mission.types';
import { createPlayerCombatEntity, createEnemyCombatEntity } from '../utils/combat-entity-factory';

export function useCombatEntitySetup() {
    const { composition, getTotalStats } = usePartyStore();

    const createCombatEntities = (mission: Mission): { playerStats: CombatEntity; enemyStats: CombatEntity } => {
        const partyStats = getTotalStats();

        // Create player entity from actual party composition
        const playerStats = createPlayerCombatEntity(composition, partyStats);

        // Create enemy entity with default setup
        const enemyStats: CombatEntity = {
            id: mission.enemy.id,
            name: mission.enemy.name,
            sprite: mission.enemy.sprite,
            maxHealth: mission.enemy.maxHealth,
            currentHealth: mission.enemy.maxHealth,
            maxShield: mission.enemy.maxShield || 0,
            currentShield: mission.enemy.maxShield || 0,
            equippedCompanions: [], // Enemies don't use dynamic companions yet
            companions: {
                attack: { currentEnergy: 0, maxEnergy: 0 },
                defend: { currentEnergy: 0, maxEnergy: 0 },
                special: { currentEnergy: 0, maxEnergy: 0 },
            },
        };

        return { playerStats, enemyStats };
    };

    return { createCombatEntities };
}
