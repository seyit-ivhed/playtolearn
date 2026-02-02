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
        maxHealth: 100,
        attack: 20,
    },
    ASSYRIAN_GUARDIAN: {
        id: 'assyrian_guardian',
        maxHealth: 140,
        attack: 25,
    },
    SAND_SPIRIT_1: {
        id: 'sand_spirit_1',
        maxHealth: 70,
        attack: 15,
    },
    SAND_COLOSSUS: {
        id: 'sand_colossus',
        maxHealth: 250,
        attack: 30,
        isBoss: true,
    },
    THE_STONE_EMPEROR: {
        id: 'the_stone_emperor',
        maxHealth: 300,
        attack: 40,
        isBoss: true,
    },
    MIST_STALKER: {
        id: 'mist_stalker',
        maxHealth: 120,
        attack: 25,
    },
    CLOCKWORK_SCOUT: {
        id: 'clockwork_scout',
        maxHealth: 150,
        attack: 30,
    },
    STEAM_VANGUARD: {
        id: 'steam_vanguard',
        maxHealth: 200,
        attack: 40,
    },
    IRON_GRENADIER: {
        id: 'iron_grenadier',
        maxHealth: 200,
        attack: 45,
    },
    MECHANICAL_HOUND: {
        id: 'mechanical_hound',
        maxHealth: 160,
        attack: 40,
    },
    IRON_MINION: {
        id: 'iron_minion',
        maxHealth: 160,
        attack: 30,
    },
    IRON_WARLORD_ENFORCER: {
        id: 'iron_warlord_enforcer',
        maxHealth: 500,
        attack: 60,
        isBoss: true,
    },
    IRON_WARLORD: {
        id: 'iron_warlord',
        maxHealth: 650,
        attack: 80,
        isBoss: true,
    },
    // Adventure 5 Monsters - The Scorched Plains
    BLAZE_HYENA: {
        id: 'blaze_hyena',
        maxHealth: 180,
        attack: 45,
    },
    EMBER_LIONESS: {
        id: 'ember_lioness',
        maxHealth: 220,
        attack: 55,
    },
    SUN_SCORCHED_RHINO: {
        id: 'sun_scorched_rhino',
        maxHealth: 300,
        attack: 40,
    },
    MIRAGE_SPIRIT: {
        id: 'mirage_spirit',
        maxHealth: 150,
        attack: 60,
    },
    // Adventure 6 Monsters - Harmony Restored
    DISCORD_SPIRIT: {
        id: 'discord_spirit',
        maxHealth: 250,
        attack: 60,
    },
    HOLLOW_SHELL: {
        id: 'hollow_shell',
        maxHealth: 300,
        attack: 50,
    },
    TWISTED_REFLECTION: {
        id: 'twisted_reflection',
        maxHealth: 200,
        attack: 70,
    },
    // Adventure 6 Boss
    SPIRIT_KING: {
        id: 'spirit_king',
        maxHealth: 1000,
        attack: 100,
        isBoss: true,
    },
} as const satisfies Record<string, AdventureMonster>;
