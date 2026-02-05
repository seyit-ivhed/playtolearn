import type { AdventureMonster } from '../types/adventure.types';

export const MONSTERS = {
    // Adventure 1 Monsters
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
        maxHealth: 50,
        attack: 12,
    },
    BANDIT_LEADER: {
        id: 'bandit_leader',
        maxHealth: 95,
        attack: 13,
    },
    BANDIT_RAIDER: {
        id: 'bandit_raider',
        maxHealth: 80,
        attack: 14,
    },
    STONE_GUARDIAN: {
        id: 'stone_guardian',
        maxHealth: 120,
        attack: 22,
    },
    ASSYRIAN_GUARDIAN: {
        id: 'assyrian_guardian',
        maxHealth: 140,
        attack: 25,
    },
    SAND_SPIRIT_1: {
        id: 'sand_spirit_1',
        maxHealth: 90,
        attack: 18,
    },
    SAND_COLOSSUS: {
        id: 'sand_colossus',
        maxHealth: 325,
        attack: 30,
        isBoss: true,
    },
    THE_STONE_EMPEROR: {
        id: 'the_stone_emperor',
        maxHealth: 375,
        attack: 38,
        isBoss: true,
    },
    MIST_RONIN: {
        id: 'mist_ronin',
        maxHealth: 110,
        attack: 22,
    },
    NINJA_SCOUT: {
        id: 'ninja_scout',
        maxHealth: 135,
        attack: 26,
    },
    SAMURAI_VANGUARD: {
        id: 'samurai_vanguard',
        maxHealth: 240,
        attack: 45,
    },
    SAMURAI_ARCHER: {
        id: 'samurai_archer',
        maxHealth: 220,
        attack: 50,
    },
    WAR_HOUND: {
        id: 'war_hound',
        maxHealth: 160,
        attack: 38,
    },
    SAMURAI_SOLDIER: {
        id: 'samurai_soldier',
        maxHealth: 150,
        attack: 28,
    },
    SAMURAI_COMMANDER: {
        id: 'samurai_commander',
        maxHealth: 640,
        attack: 70,
        isBoss: true,
    },
    EVIL_SHOGUN: {
        id: 'evil_shogun',
        maxHealth: 650,
        attack: 85,
        isBoss: true,
    },
    // Adventure 5 Monsters - The Scorched Plains
    // Adventure 5 Monsters - The Scorched Plains
    BLAZE_HYENA: {
        id: 'blaze_hyena',
        maxHealth: 105,
        attack: 27,
    },
    EMBER_LIONESS: {
        id: 'ember_lioness',
        maxHealth: 190,
        attack: 48,
    },
    SUN_SCORCHED_RHINO: {
        id: 'sun_scorched_rhino',
        maxHealth: 320,
        attack: 40,
    },
    MIRAGE_SPIRIT: {
        id: 'mirage_spirit',
        maxHealth: 170,
        attack: 50,
    },
    // Adventure 5 Boss
    INFERNO_MANE: {
        id: 'inferno_mane',
        maxHealth: 980,
        attack: 98,
        isBoss: true,
    },
    // Adventure 6 Monsters - The Spirit Realm
    DISCORD_SPIRIT: {
        id: 'discord_spirit',
        maxHealth: 280,
        attack: 65,
    },
    HOLLOW_SHELL: {
        id: 'hollow_shell',
        maxHealth: 160,
        attack: 28,
    },
    TWISTED_REFLECTION: {
        id: 'twisted_reflection',
        maxHealth: 250,
        attack: 60,
    },
    // Adventure 6 Boss
    SPIRIT_KING: {
        id: 'spirit_king',
        maxHealth: 1100,
        attack: 100,
        isBoss: true,
    },
} as const satisfies Record<string, AdventureMonster>;
