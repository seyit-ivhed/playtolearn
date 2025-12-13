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
import fireKnightImg from '../assets/images/companions/fire_knight.png';
import shadowArcherImg from '../assets/images/companions/shadow_archer.png';
import crystalGuardianImg from '../assets/images/companions/crystal_guardian.png';
import lightHealerImg from '../assets/images/companions/light_healer.png';
import lightningMageImg from '../assets/images/companions/lightning_mage.png';
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
    },
    'fire_knight': {
        id: 'fire_knight',
        name: 'Fire Knight',
        role: CompanionRole.WARRIOR,
        description: 'A brave warrior who wields a flaming sword.',
        maxHealth: 130,
        abilityName: 'Flame Strike',
        abilityDescription: 'Deals 15 damage to a single enemy.',
        abilityDamage: 15,
        specialAbility: {
            name: 'Inferno Blade',
            description: 'Deals 35 heavy damage to a single target.',
            type: 'DAMAGE',
            value: 35,
            target: 'SINGLE_ENEMY'
        },
        color: '#e74c3c', // Red
        icon: '⚔️',
        image: fireKnightImg,
        initialSpirit: 50
    },
    'shadow_archer': {
        id: 'shadow_archer',
        name: 'Shadow Archer',
        role: CompanionRole.WARRIOR,
        description: 'A precise archer who strikes from the shadows.',
        maxHealth: 110,
        abilityName: 'Shadow Arrow',
        abilityDescription: 'Deals 12 damage that ignores armor.',
        abilityDamage: 12,
        specialAbility: {
            name: 'Rain of Arrows',
            description: 'Deals 10 damage to ALL enemies.',
            type: 'DAMAGE',
            value: 10,
            target: 'ALL_ENEMIES'
        },
        color: '#2c3e50', // Dark Blue
        icon: '🏹',
        image: shadowArcherImg,
        initialSpirit: 50
    },
    'crystal_guardian': {
        id: 'crystal_guardian',
        name: 'Crystal Guardian',
        role: CompanionRole.GUARDIAN,
        description: 'A gentle protector made of living crystal.',
        maxHealth: 200,
        abilityName: 'Crystal Shield',
        abilityDescription: 'Grants 20 Shield to a friend.',
        abilityShield: 20,
        specialAbility: {
            name: 'Crystal Fortress',
            description: 'Grants 30 Shield to ALL allies.',
            type: 'SHIELD',
            value: 30,
            target: 'ALL_ALLIES'
        },
        color: '#3498db', // Blue
        icon: '🛡️',
        image: crystalGuardianImg,
        initialSpirit: 50
    },
    'light_healer': {
        id: 'light_healer',
        name: 'Light Healer',
        role: CompanionRole.SUPPORT,
        description: 'A kind spirit who mends wounds.',
        maxHealth: 100,
        abilityName: 'Healing Light',
        abilityDescription: 'Heals a friend for 15 Health.',
        abilityHeal: 15,
        specialAbility: {
            name: 'Divine Light',
            description: 'Heals ALL allies for 20 HP.',
            type: 'HEAL',
            value: 20,
            target: 'ALL_ALLIES'
        },
        color: '#f1c40f', // Gold
        icon: '✨',
        image: lightHealerImg,
        initialSpirit: 50
    },
    // Extra for full party testing
    'lightning_mage': {
        id: 'lightning_mage',
        name: 'Lightning Mage',
        role: CompanionRole.WARRIOR,
        description: 'Crackling with unstable energy.',
        maxHealth: 110,
        abilityName: 'Thunder Bolt',
        abilityDescription: 'Deals 25 massive damage, needs recharge often.',
        abilityDamage: 25,
        specialAbility: {
            name: 'Thunderstorm',
            description: 'Deals 15 damage to random enemies 3 times.',
            type: 'MULTI_HIT',
            value: 15,
            count: 3,
            target: 'RANDOM_ENEMY'
        },
        color: '#9b59b6', // Purple
        icon: '⚡',
        image: lightningMageImg,
        initialSpirit: 50
    }
};

export const INITIAL_FELLOWSHIP = ['village_squire', 'novice_archer'];

export const getAllCompanions = () => Object.values(COMPANIONS);
export const getCompanionById = (id: string) => COMPANIONS[id];

