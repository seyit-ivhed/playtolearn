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
            variables: { damage: 30 }
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
                    variables: { damage: 45 }
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
                    variables: { damage: 65 }
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
                    variables: { damage: 100 }
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
            variables: { heal: 25 }
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
                    variables: { heal: 35 }
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
                    variables: { heal: 50 }
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
                    variables: { heal: 80 }
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
            variables: { damage: 20, duration: 2, reduction: 50 }
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
                    variables: { damage: 30, duration: 2, reduction: 50 }
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
                    variables: { damage: 45, duration: 2, reduction: 50 }
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
                    variables: { damage: 65, duration: 2, reduction: 50 }
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
            variables: { damage: 15 }
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
                    variables: { damage: 25 }
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
                    variables: { damage: 40 }
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
                    variables: { damage: 65 }
                }
            }
        ]
    }
};

export const INITIAL_FELLOWSHIP = ['amara', 'tariq'];

export const getCompanionById = (id: string) => COMPANIONS[id];
