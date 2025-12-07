import { CompanionRole, CombatActionBehavior, type Companion } from '../types/party.types';

export const COMPANIONS: Record<string, Companion> = {
    // Warrior Companions (Offensive - Deal Damage)
    'companion_fire_knight': {
        id: 'companion_fire_knight',
        name: 'Fire Knight',
        role: CompanionRole.WARRIOR,
        combatAction: CombatActionBehavior.ATTACK,
        mathSkill: 'addition',
        level: 1,
        stats: {
            attack: 10,
            energyCost: 0,
            maxEnergy: 3
        },
        cost: 0,
        description: 'A brave knight wielding flames. Strikes enemies with burning attacks.',
        requirements: {
            minLevel: 1
        }
    },
    'companion_shadow_archer': {
        id: 'companion_shadow_archer',
        name: 'Shadow Archer',
        role: CompanionRole.WARRIOR,
        combatAction: CombatActionBehavior.ATTACK,
        mathSkill: 'subtraction',
        level: 1,
        stats: {
            attack: 12,
            energyCost: 1,
            maxEnergy: 2
        },
        cost: 100,
        description: 'Silent and precise. Shoots arrows from the shadows.',
        requirements: {
            questId: 2
        }
    },
    'companion_lightning_mage': {
        id: 'companion_lightning_mage',
        name: 'Lightning Mage',
        role: CompanionRole.WARRIOR,
        combatAction: CombatActionBehavior.ATTACK,
        mathSkill: 'multiplication',
        level: 1,
        stats: {
            attack: 15,
            energyCost: 2,
            maxEnergy: 3
        },
        cost: 150,
        description: 'Channels the power of storms. Casts devastating lightning bolts.',
        requirements: {
            questId: 3
        }
    },
    'companion_frost_ranger': {
        id: 'companion_frost_ranger',
        name: 'Frost Ranger',
        role: CompanionRole.WARRIOR,
        combatAction: CombatActionBehavior.ATTACK,
        mathSkill: 'division',
        level: 1,
        stats: {
            attack: 13,
            energyCost: 2,
            maxEnergy: 2
        },
        cost: 150,
        description: 'Master of ice and cold. Freezes enemies with chilling arrows.',
        requirements: {
            questId: 4
        }
    },

    // Guardian Companions (Defensive - Protect Party)
    'companion_crystal_guardian': {
        id: 'companion_crystal_guardian',
        name: 'Crystal Guardian',
        role: CompanionRole.GUARDIAN,
        combatAction: CombatActionBehavior.DEFEND,
        mathSkill: 'fractions',
        level: 1,
        stats: {
            defense: 5,
            energyCost: 1,
            maxEnergy: 2
        },
        cost: 0,
        description: 'Protected by crystalline armor. Shields the party from harm.',
        requirements: {
            minLevel: 1
        }
    },
    'companion_earth_defender': {
        id: 'companion_earth_defender',
        name: 'Earth Defender',
        role: CompanionRole.GUARDIAN,
        combatAction: CombatActionBehavior.DEFEND,
        mathSkill: 'decimals',
        level: 1,
        stats: {
            defense: 15,
            energyCost: 3,
            maxEnergy: 2
        },
        cost: 200,
        description: 'Strong as stone. Raises earthen barriers to block attacks.',
        requirements: {
            questId: 4
        }
    },

    // Support Companions (Healing & Utility)
    'companion_light_healer': {
        id: 'companion_light_healer',
        name: 'Light Healer',
        role: CompanionRole.SUPPORT,
        combatAction: CombatActionBehavior.HEAL,
        mathSkill: 'mixed',
        level: 1,
        stats: {
            health: 20,
            energyCost: 10,
            maxEnergy: 1
        },
        cost: 300,
        description: 'Blessed with healing magic. Restores the party with radiant light.',
        requirements: {
            questId: 5
        }
    },
    'companion_nature_druid': {
        id: 'companion_nature_druid',
        name: 'Nature Druid',
        role: CompanionRole.SUPPORT,
        combatAction: CombatActionBehavior.SPECIAL,
        mathSkill: 'word-problems',
        level: 1,
        stats: {
            health: 30,
            speed: -3,
            maxEnergy: 0
        },
        cost: 150,
        description: 'In harmony with nature. Provides gradual healing and protection.',
        requirements: {
            questId: 2
        }
    }
};

/**
 * Get companion by ID
 */
export const getCompanionById = (id: string): Companion | undefined => {
    return COMPANIONS[id];
};

/**
 * Get all companions
 */
export const getAllCompanions = (): Companion[] => {
    return Object.values(COMPANIONS);
};

/**
 * Get companions by role
 */
export const getCompanionsByRole = (role: CompanionRole): Companion[] => {
    return getAllCompanions().filter(c => c.role === role);
};

/**
 * Get companions by math skill
 */
export const getCompanionsByMathSkill = (mathSkill: string): Companion[] => {
    return getAllCompanions().filter(c => c.mathSkill === mathSkill);
};
