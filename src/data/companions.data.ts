export const CompanionRole = {
    WARRIOR: 'WARRIOR',
    GUARDIAN: 'GUARDIAN',
    SUPPORT: 'SUPPORT'
} as const;

export type CompanionRole = typeof CompanionRole[keyof typeof CompanionRole];

export interface SpecialAbility {
    name: string;
    description: string;
    type: 'DAMAGE' | 'HEAL' | 'SHIELD' | 'MULTI_HIT';
    value: number;
    target: 'SINGLE_ENEMY' | 'ALL_ENEMIES' | 'SINGLE_ALLY' | 'ALL_ALLIES' | 'SELF' | 'RANDOM_ENEMY';
    count?: number; // For multi-hit
}

export interface Companion {
    id: string;
    name: string;
    role: CompanionRole;
    description: string;
    maxHealth: number;
    // Ability details
    abilityName: string;
    abilityDescription: string;
    abilityDamage?: number;
    abilityHeal?: number;
    abilityShield?: number;
    // Special Ability
    specialAbility: SpecialAbility;
    // Visuals (placeholders for now)
    color: string;
    icon: string;
    image: string;
    // Configuration
    initialSpirit: number;
}

// Images
import villageSquireImg from '../assets/images/companions/village_squire.png';
import noviceArcherImg from '../assets/images/companions/novice_archer.png';

export const COMPANIONS: Record<string, Companion> = {
    'village_squire': {
        id: 'village_squire',
        name: 'Village Squire',
        role: CompanionRole.WARRIOR,
        description: 'A young hero with a rusty sword and a big heart.',
        maxHealth: 90,
        abilityName: 'Clumsy Strike',
        abilityDescription: 'Deals 8 damage to a single enemy.',
        abilityDamage: 8,
        specialAbility: {
            name: 'Protective Stance',
            description: 'Grants 15 Shield to ALL allies.',
            type: 'SHIELD',
            value: 15,
            target: 'ALL_ALLIES'
        },
        color: '#e74c3c', // Red
        icon: '🗡️',
        image: villageSquireImg,
        initialSpirit: 70
    },
    'novice_archer': {
        id: 'novice_archer',
        name: 'Novice Archer',
        role: CompanionRole.WARRIOR,
        description: 'Still learning to aim, but has keen eyes.',
        maxHealth: 80,
        abilityName: 'Practice Shot',
        abilityDescription: 'Deals 6 damage.',
        abilityDamage: 6,
        specialAbility: {
            name: 'Piercing Shot',
            description: 'Deals 20 damage ignoring armor.',
            type: 'DAMAGE',
            value: 20,
            target: 'SINGLE_ENEMY'
        },
        color: '#2c3e50', // Dark Blue
        icon: '🏹',
        image: noviceArcherImg,
        initialSpirit: 30
    }
};

export const INITIAL_FELLOWSHIP = ['village_squire', 'novice_archer'];

export const getAllCompanions = () => Object.values(COMPANIONS);
export const getCompanionById = (id: string) => COMPANIONS[id];

