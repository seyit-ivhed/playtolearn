export const CompanionRole = {
    WARRIOR: 'WARRIOR',
    GUARDIAN: 'GUARDIAN',
    SUPPORT: 'SUPPORT'
} as const;

export type CompanionRole = typeof CompanionRole[keyof typeof CompanionRole];

export interface SpecialAbility {
    id: string; // Used for translation key and VFX lookup
    type: 'DAMAGE' | 'HEAL' | 'SHIELD' | 'MULTI_HIT';
    value: number;
    target: 'SINGLE_ENEMY' | 'ALL_ENEMIES' | 'SINGLE_ALLY' | 'ALL_ALLIES' | 'SELF' | 'RANDOM_ENEMY';
    count?: number; // For multi-hit
}

export interface CompanionStats {
    maxHealth: number;
    abilityDamage?: number;
    abilityHeal?: number;
    abilityShield?: number;
}

export interface CompanionEvolution {
    atLevel: number;
    title: string;
    image: string;
    statsBonus?: Partial<CompanionStats>;
    newSpecialAbility?: SpecialAbility;
}

export const XP_PER_LEVEL = 100; // Linear curve for now: Level * 100

export interface Companion {
    id: string;
    // Identity
    name: string;
    title: string;
    role: CompanionRole;

    // Progression
    level: number;
    xp: number;

    // Stats
    baseStats: CompanionStats;
    stats: CompanionStats; // Current calculated stats

    // Ability details
    // We keep these for backward compatibility or ease of access, 
    // but they should mirror 'stats'
    abilityDamage?: number;
    abilityHeal?: number;
    abilityShield?: number;
    maxHealth: number;

    // Special Ability
    specialAbility: SpecialAbility;

    // Visuals
    image: string;

    // Configuration
    initialSpirit: number;

    evolutions: CompanionEvolution[];
}

// Images
import villageSquireImg from '../assets/images/companions/village_squire.png';
import noviceArcherImg from '../assets/images/companions/novice_archer.png';

export const COMPANIONS: Record<string, Companion> = {
    'village_squire': {
        id: 'village_squire',
        name: 'Garrick',
        title: 'Village Squire',
        role: CompanionRole.WARRIOR,
        level: 1,
        xp: 0,
        baseStats: {
            maxHealth: 90,
            abilityDamage: 8
        },
        stats: {
            maxHealth: 90,
            abilityDamage: 8
        },
        maxHealth: 90,
        abilityDamage: 8,
        specialAbility: {
            id: 'protective_stance',
            type: 'SHIELD',
            value: 15,
            target: 'ALL_ALLIES'
        },
        image: villageSquireImg,
        initialSpirit: 70,
        evolutions: [
            {
                atLevel: 5,
                title: 'Knight',
                image: villageSquireImg, // Placeholder
                statsBonus: {
                    maxHealth: 20,
                    abilityDamage: 4
                }
            }
        ]
    },
    'novice_archer': {
        id: 'novice_archer',
        name: 'Elara',
        title: 'Novice Archer',
        role: CompanionRole.WARRIOR,
        level: 1,
        xp: 0,
        baseStats: {
            maxHealth: 80,
            abilityDamage: 6
        },
        stats: {
            maxHealth: 80,
            abilityDamage: 6
        },
        maxHealth: 80,
        abilityDamage: 6,
        specialAbility: {
            id: 'piercing_shot',
            type: 'DAMAGE',
            value: 20,
            target: 'SINGLE_ENEMY'
        },
        image: noviceArcherImg,
        initialSpirit: 30,
        evolutions: [
            {
                atLevel: 5,
                title: 'Ranger',
                image: noviceArcherImg, // Placeholder
                statsBonus: {
                    maxHealth: 15,
                    abilityDamage: 5
                }
            }
        ]
    }
};

export const INITIAL_FELLOWSHIP = ['village_squire', 'novice_archer'];

export const getAllCompanions = () => Object.values(COMPANIONS);
export const getCompanionById = (id: string) => COMPANIONS[id];

