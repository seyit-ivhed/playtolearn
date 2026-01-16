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
    DESERT_SCAVENGER: {
        id: 'desert_scavenger',
        maxHealth: 40,
        attack: 10,
    },
    BANDIT_LEADER: {
        id: 'bandit_leader',
        maxHealth: 100,
        attack: 12,
    },
    BANDIT_RAIDER: {
        id: 'bandit_raider',
        maxHealth: 70,
        attack: 12,
    },
    STONE_GUARDIAN: {
        id: 'stone_guardian',
        maxHealth: 80,
        attack: 18,
    },
    ASSYRIAN_GUARDIAN: {
        id: 'assyrian_guardian',
        maxHealth: 110,
        attack: 25,
    },
    SAND_SPIRIT_1: {
        id: 'sand_spirit_1',
        maxHealth: 60,
        attack: 12,
    },
    SAND_COLOSSUS: {
        id: 'sand_colossus',
        maxHealth: 180,
        attack: 25,
        isBoss: true,
    },
    THE_STONE_EMPEROR: {
        id: 'the_stone_emperor',
        maxHealth: 260,
        attack: 40,
        isBoss: true,
    },
} as const satisfies Record<string, AdventureMonster>;
