import type { Companion } from '../types/companion.types';

export const EVOLUTION_LEVELS = {
    STAGE_1: 4,
    STAGE_2: 8,
    STAGE_3: 12,
} as const;

export const COMPANIONS: Record<string, Companion> = {
    'amara': {
        id: 'amara',
        name: 'Amara',
        title: 'The Jungle Ranger',
        level: 1,
        baseStats: {
            maxHealth: 75,
            abilityDamage: 8,
            spiritGain: 35
        },
        stats: {
            maxHealth: 75,
            abilityDamage: 8,
            spiritGain: 35
        },
        specialAbility: {
            id: 'jaguar_strike',
            type: 'DAMAGE',
            value: 30,
            target: 'SINGLE_ENEMY'
        },
        initialSpirit: 65,
        evolutions: [
            {
                atLevel: EVOLUTION_LEVELS.STAGE_1,
                title: 'Jungle Tracker',
                statsBonus: {
                    maxHealth: 15,
                    abilityDamage: 4
                },
                newSpecialAbility: {
                    id: 'jaguar_strike_2',
                    type: 'DAMAGE',
                    value: 45,
                    target: 'SINGLE_ENEMY'
                }
            },
            {
                atLevel: EVOLUTION_LEVELS.STAGE_2,
                title: 'Apex Stalker',
                statsBonus: {
                    maxHealth: 20,
                    abilityDamage: 6
                },
                newSpecialAbility: {
                    id: 'jaguar_strike_3',
                    type: 'DAMAGE',
                    value: 65,
                    target: 'SINGLE_ENEMY'
                }
            },
            {
                atLevel: EVOLUTION_LEVELS.STAGE_3,
                title: 'Nature\'s Wrath',
                statsBonus: {
                    maxHealth: 30,
                    abilityDamage: 10
                },
                newSpecialAbility: {
                    id: 'jaguar_strike_4',
                    type: 'DAMAGE',
                    value: 100,
                    target: 'SINGLE_ENEMY'
                }
            }
        ]
    },
    'tariq': {
        id: 'tariq',
        name: 'Tariq',
        title: 'The Desert Alchemist',
        level: 1,
        baseStats: {
            maxHealth: 85,
            abilityDamage: 5,
            spiritGain: 35
        },
        stats: {
            maxHealth: 85,
            abilityDamage: 5,
            spiritGain: 35
        },
        specialAbility: {
            id: 'elixir_of_life',
            type: 'HEAL',
            value: 25,
            target: 'ALL_ALLIES'
        },
        initialSpirit: 0,
        evolutions: [
            {
                atLevel: EVOLUTION_LEVELS.STAGE_1,
                title: 'Desert Physician',
                statsBonus: {
                    maxHealth: 15,
                    abilityDamage: 3
                },
                newSpecialAbility: {
                    id: 'elixir_of_life_2',
                    type: 'HEAL',
                    value: 35,
                    target: 'ALL_ALLIES'
                }
            },
            {
                atLevel: EVOLUTION_LEVELS.STAGE_2,
                title: 'Master Alchemist',
                statsBonus: {
                    maxHealth: 20,
                    abilityDamage: 4
                },
                newSpecialAbility: {
                    id: 'elixir_of_life_3',
                    type: 'HEAL',
                    value: 50,
                    target: 'ALL_ALLIES'
                }
            },
            {
                atLevel: EVOLUTION_LEVELS.STAGE_3,
                title: 'Sage of Sands',
                statsBonus: {
                    maxHealth: 30,
                    abilityDamage: 6
                },
                newSpecialAbility: {
                    id: 'elixir_of_life_4',
                    type: 'HEAL',
                    value: 80,
                    target: 'ALL_ALLIES'
                }
            }
        ]
    },
    'kenji': {
        id: 'kenji',
        name: 'Kenji',
        title: 'The Mountain Samurai',
        level: 1,
        baseStats: {
            maxHealth: 100,
            abilityDamage: 7,
            spiritGain: 35
        },
        stats: {
            maxHealth: 100,
            abilityDamage: 7,
            spiritGain: 35
        },
        specialAbility: {
            id: 'blade_barrier',
            type: 'SHIELD',
            value: 12,
            target: 'ALL_ALLIES'
        },
        initialSpirit: 60,
        evolutions: [
            {
                atLevel: EVOLUTION_LEVELS.STAGE_1,
                title: 'Ronin Defender',
                statsBonus: {
                    maxHealth: 20,
                    abilityDamage: 3
                },
                newSpecialAbility: {
                    id: 'blade_barrier_2',
                    type: 'SHIELD',
                    value: 18,
                    target: 'ALL_ALLIES'
                }
            },
            {
                atLevel: EVOLUTION_LEVELS.STAGE_2,
                title: 'Steel Sentinel',
                statsBonus: {
                    maxHealth: 25,
                    abilityDamage: 4
                },
                newSpecialAbility: {
                    id: 'blade_barrier_3',
                    type: 'SHIELD',
                    value: 25,
                    target: 'ALL_ALLIES'
                }
            },
            {
                atLevel: EVOLUTION_LEVELS.STAGE_3,
                title: 'Shogun\'s Wall',
                statsBonus: {
                    maxHealth: 35,
                    abilityDamage: 5
                },
                newSpecialAbility: {
                    id: 'blade_barrier_4',
                    type: 'SHIELD',
                    value: 40,
                    target: 'ALL_ALLIES'
                }
            }
        ]
    },
    'zahara': {
        id: 'zahara',
        name: 'Zahara',
        title: 'The Savannah Mage',
        level: 1,
        baseStats: {
            maxHealth: 70,
            abilityDamage: 8,
            spiritGain: 35
        },
        stats: {
            maxHealth: 70,
            abilityDamage: 8,
            spiritGain: 35
        },
        specialAbility: {
            id: 'ancestral_storm',
            type: 'DAMAGE',
            value: 15,
            target: 'ALL_ENEMIES'
        },
        initialSpirit: 40,
        evolutions: [
            {
                atLevel: EVOLUTION_LEVELS.STAGE_1,
                title: 'Sun Caller',
                statsBonus: {
                    maxHealth: 10,
                    abilityDamage: 5
                },
                newSpecialAbility: {
                    id: 'ancestral_storm_2',
                    type: 'DAMAGE',
                    value: 25,
                    target: 'ALL_ENEMIES'
                }
            },
            {
                atLevel: EVOLUTION_LEVELS.STAGE_2,
                title: 'Ember Weaver',
                statsBonus: {
                    maxHealth: 15,
                    abilityDamage: 7
                },
                newSpecialAbility: {
                    id: 'ancestral_storm_3',
                    type: 'DAMAGE',
                    value: 40,
                    target: 'ALL_ENEMIES'
                }
            },
            {
                atLevel: EVOLUTION_LEVELS.STAGE_3,
                title: 'Radiant Seer',
                statsBonus: {
                    maxHealth: 20,
                    abilityDamage: 10
                },
                newSpecialAbility: {
                    id: 'ancestral_storm_4',
                    type: 'DAMAGE',
                    value: 65,
                    target: 'ALL_ENEMIES'
                }
            }
        ]
    }
};

export const INITIAL_FELLOWSHIP = ['amara', 'tariq'];

export const getCompanionById = (id: string) => COMPANIONS[id];
