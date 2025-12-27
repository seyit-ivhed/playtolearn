import type { AdventureMonster } from '../types/adventure.types';

export const MONSTERS = {
    SCORPION_1: {
        id: 'scorpion_1',
        maxHealth: 40,
        attack: 8,
    },
    TINY_SCORPION: {
        id: 'tiny_scorpion',
        maxHealth: 15,
        attack: 4,
    },
    SCORPION_RAIDER: {
        id: 'scorpion_raider',
        maxHealth: 50,
        attack: 10,
    },
    SCAVENGER: {
        id: 'scavenger',
        maxHealth: 35,
        attack: 8,
    },
    BANDIT_RAIDER: {
        id: 'bandit_raider',
        maxHealth: 55,
        attack: 12,
    },
    STONE_GUARDIAN: {
        id: 'stone_guardian',
        maxHealth: 70,
        attack: 10,
    },
    ASSYRIAN_GUARDIAN: {
        id: 'assyrian_guardian',
        maxHealth: 100,
        attack: 18,
    },
    SAND_SPIRIT_1: {
        id: 'sand_spirit_1',
        maxHealth: 60,
        attack: 15,
    },
    SAND_COLOSSUS: {
        id: 'sand_colossus',
        maxHealth: 180,
        attack: 25,
        isBoss: true,
    },
    THE_STONE_EMPEROR: {
        id: 'the_stone_emperor',
        maxHealth: 250,
        attack: 30,
        isBoss: true,
    },
} as const satisfies Record<string, AdventureMonster>;
