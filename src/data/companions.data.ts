export const CompanionRole = {
    WARRIOR: 'WARRIOR',
    GUARDIAN: 'GUARDIAN',
    SUPPORT: 'SUPPORT'
} as const;

export type CompanionRole = typeof CompanionRole[keyof typeof CompanionRole];

export interface Companion {
    id: string;
    name: string;
    role: CompanionRole;
    description: string;
    maxHealth: number;
    maxEnergy: number;
    // Ability details
    abilityName: string;
    abilityDescription: string;
    abilityDamage?: number;
    abilityHeal?: number;
    abilityShield?: number;
    // Visuals (placeholders for now)
    color: string;
    icon: string;
}

export const COMPANIONS: Record<string, Companion> = {
    'fire_knight': {
        id: 'fire_knight',
        name: 'Fire Knight',
        role: CompanionRole.WARRIOR,
        description: 'A brave warrior who wields a flaming sword.',
        maxHealth: 50,
        maxEnergy: 3,
        abilityName: 'Flame Strike',
        abilityDescription: 'Deals 15 damage to a single enemy.',
        abilityDamage: 15,
        color: '#e74c3c', // Red
        icon: '⚔️'
    },
    'shadow_archer': {
        id: 'shadow_archer',
        name: 'Shadow Archer',
        role: CompanionRole.WARRIOR,
        description: 'A precise archer who strikes from the shadows.',
        maxHealth: 40,
        maxEnergy: 3,
        abilityName: 'Shadow Arrow',
        abilityDescription: 'Deals 12 damage that ignores armor.',
        abilityDamage: 12,
        color: '#2c3e50', // Dark Blue
        icon: '🏹'
    },
    'crystal_guardian': {
        id: 'crystal_guardian',
        name: 'Crystal Guardian',
        role: CompanionRole.GUARDIAN,
        description: 'A gentle protector made of living crystal.',
        maxHealth: 80,
        maxEnergy: 2,
        abilityName: 'Crystal Shield',
        abilityDescription: 'Grants 20 Shield to a friend.',
        abilityShield: 20,
        color: '#3498db', // Blue
        icon: '🛡️'
    },
    'light_healer': {
        id: 'light_healer',
        name: 'Light Healer',
        role: CompanionRole.SUPPORT,
        description: 'A kind spirit who mends wounds.',
        maxHealth: 35,
        maxEnergy: 4,
        abilityName: 'Healing Light',
        abilityDescription: 'Heals a friend for 15 Health.',
        abilityHeal: 15,
        color: '#f1c40f', // Gold
        icon: '✨'
    },
    // Extra for full party testing
    'lightning_mage': {
        id: 'lightning_mage',
        name: 'Lightning Mage',
        role: CompanionRole.WARRIOR,
        description: 'Crackling with unstable energy.',
        maxHealth: 40,
        maxEnergy: 2,
        abilityName: 'Thunder Bolt',
        abilityDescription: 'Deals 25 massive damage, needs recharge often.',
        abilityDamage: 25,
        color: '#9b59b6', // Purple
        icon: '⚡'
    }
};

export const INITIAL_FELLOWSHIP = ['fire_knight', 'crystal_guardian', 'light_healer', 'shadow_archer'];

export const getAllCompanions = () => Object.values(COMPANIONS);
export const getCompanionById = (id: string) => COMPANIONS[id];
