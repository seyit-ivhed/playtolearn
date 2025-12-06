import type { CombatEntity, ModuleInstance } from '../types/combat.types';
import type { ShipLoadout, ShipStats, ShipModule } from '../types/ship.types';
import { getCombatSlots } from '../data/slots.data';
import { getModuleById } from '../data/modules.data';

/**
 * Creates a CombatEntity from ship loadout and stats
 * Converts equipped modules into ModuleInstances for combat
 */
export function createPlayerCombatEntity(
    shipLoadout: ShipLoadout,
    shipStats: ShipStats
): CombatEntity {
    const combatSlots = getCombatSlots();

    const equippedModules: ModuleInstance[] = combatSlots
        .map(slot => {
            const moduleId = shipLoadout[slot.id];
            if (!moduleId) return null;

            const module = getModuleById(moduleId);
            if (!module || !module.combatAction) return null;

            return {
                moduleId: module.id,
                slotId: slot.id,
                currentEnergy: module.stats.maxEnergy || 1,
                maxEnergy: module.stats.maxEnergy || 1,
                combatAction: module.combatAction as string
            };
        })
        .filter((m): m is ModuleInstance => m !== null && m !== undefined);

    return {
        id: 'player',
        name: 'Player',
        maxHealth: shipStats.maxHealth,
        currentHealth: shipStats.health,
        maxShield: 50,
        currentShield: 50,
        equippedModules,
        // Legacy modules structure for backward compatibility
        modules: {
            attack: { currentEnergy: 3, maxEnergy: 3 },
            defend: { currentEnergy: 2, maxEnergy: 2 },
            special: { currentEnergy: 2, maxEnergy: 2 },
        },
        sprite: '/assets/images/ships/player_ship.png'
    };
}

/**
 * Creates an enemy CombatEntity with default modules
 */
export function createEnemyCombatEntity(
    name: string,
    health: number,
    modules?: ShipModule[]
): CombatEntity {
    const equippedModules: ModuleInstance[] = modules
        ? modules.map((module, index) => ({
            moduleId: module.id,
            slotId: `enemy_slot_${index}`,
            currentEnergy: module.stats.maxEnergy || 1,
            maxEnergy: module.stats.maxEnergy || 1,
            combatAction: module.combatAction || 'ATTACK'
        }))
        : [];

    return {
        id: 'enemy',
        name,
        maxHealth: health,
        currentHealth: health,
        maxShield: 0,
        currentShield: 0,
        equippedModules,
        // Legacy modules structure
        modules: {
            attack: { currentEnergy: 0, maxEnergy: 0 },
            defend: { currentEnergy: 0, maxEnergy: 0 },
            special: { currentEnergy: 0, maxEnergy: 0 },
        }
    };
}
