import { useShipStore } from '../stores/ship.store';
import type { CombatEntity } from '../types/combat.types';
import type { Mission } from '../types/mission.types';

export function useCombatEntitySetup() {
    const { getTotalStats } = useShipStore();

    const createCombatEntities = (mission: Mission): { playerStats: CombatEntity; enemyStats: CombatEntity } => {
        const shipStats = getTotalStats();

        const playerStats: CombatEntity = {
            id: 'player',
            name: 'Player Ship',
            sprite: '/src/assets/images/ships/player_ship.png',
            maxHealth: shipStats.maxHealth,
            currentHealth: shipStats.health,
            maxShield: 50,
            currentShield: 50,
            maxEnergy: shipStats.maxEnergy,
            currentEnergy: shipStats.energy,
        };

        const enemyStats: CombatEntity = {
            id: mission.enemy.id,
            name: mission.enemy.name,
            sprite: mission.enemy.sprite,
            maxHealth: mission.enemy.maxHealth,
            currentHealth: mission.enemy.maxHealth,
            maxShield: mission.enemy.maxShield || 0,
            currentShield: mission.enemy.maxShield || 0,
            maxEnergy: 0,
            currentEnergy: 0,
        };

        return { playerStats, enemyStats };
    };

    return { createCombatEntities };
}
