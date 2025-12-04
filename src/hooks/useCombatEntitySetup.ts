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
            modules: {
                attack: { currentEnergy: 3, maxEnergy: 3 },
                defend: { currentEnergy: 2, maxEnergy: 2 },
                special: { currentEnergy: 2, maxEnergy: 2 },
            },
        };

        const enemyStats: CombatEntity = {
            id: mission.enemy.id,
            name: mission.enemy.name,
            sprite: mission.enemy.sprite,
            maxHealth: mission.enemy.maxHealth,
            currentHealth: mission.enemy.maxHealth,
            maxShield: mission.enemy.maxShield || 0,
            currentShield: mission.enemy.maxShield || 0,
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
