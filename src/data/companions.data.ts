import { CompanionRole } from '../types/companion.types';
import type { Companion } from '../types/companion.types';

export const COMPANIONS: Record<string, Companion> = {
    'amara': {
        id: 'amara',
        name: 'Amara',
        title: 'The Jungle Ranger',
        role: CompanionRole.WARRIOR,
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
                atLevel: 5,
                title: 'Jungle Tracker',
                statsBonus: {
                    maxHealth: 15,
                    abilityDamage: 4
                },
                newSpecialAbility: {
                    id: 'hunters_mark',
                    type: 'DAMAGE',
                    value: 40,
                    target: 'SINGLE_ENEMY'
                }
            },
            {
                atLevel: 10,
                title: 'Apex Stalker',
                statsBonus: {
                    maxHealth: 20,
                    abilityDamage: 6
                },
                newSpecialAbility: {
                    id: 'twin_shadows',
                    type: 'DAMAGE',
                    value: 35,
                    target: 'ALL_ENEMIES'
                }
            },
            {
                atLevel: 15,
                title: 'Nature\'s Wrath',
                statsBonus: {
                    maxHealth: 30,
                    abilityDamage: 10
                },
                newSpecialAbility: {
                    id: 'spirit_release',
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
        role: CompanionRole.WARRIOR,
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
                atLevel: 5,
                title: 'Desert Physician',
                statsBonus: {
                    maxHealth: 15,
                    abilityDamage: 3
                },
                newSpecialAbility: {
                    id: 'elixir_of_renewal',
                    type: 'HEAL',
                    value: 35, // Stronger heal + Regen effect logic
                    target: 'ALL_ALLIES'
                }
            },
            {
                atLevel: 10,
                title: 'Master Alchemist',
                statsBonus: {
                    maxHealth: 20,
                    abilityDamage: 4
                },
                newSpecialAbility: {
                    id: 'panacea_burst',
                    type: 'HEAL',
                    value: 45, // Major heal + Cleanse logic
                    target: 'ALL_ALLIES'
                }
            },
            {
                atLevel: 15,
                title: 'Sage of Sands',
                statsBonus: {
                    maxHealth: 30,
                    abilityDamage: 6
                },
                newSpecialAbility: {
                    id: 'philosophers_brew',
                    type: 'HEAL',
                    value: 80, // Massive heal + Revive logic
                    target: 'ALL_ALLIES'
                }
            }
        ]
    }
};

export const INITIAL_FELLOWSHIP = ['amara', 'tariq'];

export const getAllCompanions = () => Object.values(COMPANIONS);
export const getCompanionById = (id: string) => COMPANIONS[id];
