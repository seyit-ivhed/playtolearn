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
        maxHealth: 110,
        attack: 14,
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
        maxHealth: 300,
        attack: 30,
        isBoss: true,
    },
    THE_STONE_EMPEROR: {
        id: 'the_stone_emperor',
        maxHealth: 350,
        attack: 35,
        isBoss: true,
    },
    MIST_RONIN: {
        id: 'mist_ronin',
        maxHealth: 125,
        attack: 26,
    },
    NINJA_SCOUT: {
        id: 'ninja_scout',
        maxHealth: 150,
        attack: 30,
    },
    SAMURAI_VANGUARD: {
        id: 'samurai_vanguard',
        maxHealth: 260,
        attack: 50,
    },
    SAMURAI_ARCHER: {
        id: 'samurai_archer',
        maxHealth: 220,
        attack: 50,
    },
    WAR_HOUND: {
        id: 'war_hound',
        maxHealth: 170,
        attack: 40,
    },
    SAMURAI_SOLDIER: {
        id: 'samurai_soldier',
        maxHealth: 165,
        attack: 32,
    },
    SAMURAI_COMMANDER: {
        id: 'samurai_commander',
        maxHealth: 600,
        attack: 70,
        isBoss: true,
    },
    EVIL_SHOGUN: {
        id: 'evil_shogun',
        maxHealth: 600,
        attack: 85,
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
        maxHealth: 270,
        attack: 65,
    },
    SUN_SCORCHED_RHINO: {
        id: 'sun_scorched_rhino',
        maxHealth: 420,
        attack: 55,
    },
    MIRAGE_SPIRIT: {
        id: 'mirage_spirit',
        maxHealth: 240,
        attack: 80,
    },
    // Adventure 5 Boss
    INFERNO_MANE: {
        id: 'inferno_mane',
        maxHealth: 1000,
        attack: 100,
        isBoss: true,
    },
    // Adventure 6 Monsters - The Spirit Realm
    DISCORD_SPIRIT: {
        id: 'discord_spirit',
        maxHealth: 310,
        attack: 75,
    },
    HOLLOW_SHELL: {
        id: 'hollow_shell',
        maxHealth: 280,
        attack: 45,
    },
    TWISTED_REFLECTION: {
        id: 'twisted_reflection',
        maxHealth: 300,
        attack: 85,
    },
    // Adventure 6 Boss
    SPIRIT_KING: {
        id: 'spirit_king',
        maxHealth: 1100,
        attack: 110,
        isBoss: true,
    },
} as const satisfies Record<string, AdventureMonster>;
