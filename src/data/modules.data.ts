import { ModuleType, CombatActionBehavior, type ShipModule } from '../types/ship.types';

export const SHIP_MODULES: Record<string, ShipModule> = {
    // Weapons
    'weapon_laser_1': {
        id: 'weapon_laser_1',
        name: 'Basic Laser',
        type: ModuleType.WEAPON,
        combatAction: CombatActionBehavior.ATTACK,
        stats: {
            attack: 10,
            energyCost: 0,
            maxEnergy: 3
        },
        cost: 0,
        description: 'Standard issue laser cannon. Reliable and energy efficient.',
        requirements: {
            minLevel: 1
        }
    },
    'weapon_missile_1': {
        id: 'weapon_missile_1',
        name: 'Missile Launcher',
        type: ModuleType.WEAPON,
        combatAction: CombatActionBehavior.ATTACK,
        stats: {
            attack: 25,
            energyCost: 5,
            maxEnergy: 2
        },
        cost: 100,
        description: 'High damage missile system. Requires energy to fire.',
        requirements: {
            missionId: 2
        }
    },
    'weapon_plasma_1': {
        id: 'weapon_plasma_1',
        name: 'Plasma Beam',
        type: ModuleType.WEAPON,
        combatAction: CombatActionBehavior.ATTACK,
        stats: {
            attack: 15,
            energyCost: 2,
            maxEnergy: 3
        },
        cost: 150,
        description: 'Continuous beam weapon that melts through armor.',
        requirements: {
            missionId: 3
        }
    },

    // Support Modules - Shields
    'shield_basic_1': {
        id: 'shield_basic_1',
        name: 'Training Shield',
        type: ModuleType.SUPPORT,
        combatAction: CombatActionBehavior.DEFEND,
        stats: {
            defense: 5,
            energyCost: 1,
            maxEnergy: 2
        },
        cost: 0,
        description: 'Basic energy shield for training purposes.',
        requirements: {
            minLevel: 1
        }
    },
    'shield_energy_1': {
        id: 'shield_energy_1',
        name: 'Energy Shield',
        type: ModuleType.SUPPORT,
        combatAction: CombatActionBehavior.DEFEND,
        stats: {
            defense: 15,
            energyCost: 3,
            maxEnergy: 2
        },
        cost: 200,
        description: 'Advanced shield generator providing superior protection.',
        requirements: {
            missionId: 4
        }
    },

    // Support Modules - Special Abilities
    'special_repair_1': {
        id: 'special_repair_1',
        name: 'Nano-Repair',
        type: ModuleType.SUPPORT,
        combatAction: CombatActionBehavior.HEAL,
        stats: {
            health: 20,
            energyCost: 10,
            maxEnergy: 1
        },
        cost: 300,
        description: 'Emergency repair system. Restores hull integrity.',
        requirements: {
            missionId: 5
        }
    },
    'armor_reinforced_1': {
        id: 'armor_reinforced_1',
        name: 'Reinforced Armor',
        type: ModuleType.SUPPORT,
        combatAction: CombatActionBehavior.SPECIAL,
        stats: {
            health: 50,
            speed: -5,
            maxEnergy: 0
        },
        cost: 150,
        description: 'Heavy plating that increases hull strength but reduces speed.',
        requirements: {
            missionId: 2
        }
    }
};

export const getModuleById = (id: string): ShipModule | undefined => {
    return SHIP_MODULES[id];
};

export const getAllModules = (): ShipModule[] => {
    return Object.values(SHIP_MODULES);
};
