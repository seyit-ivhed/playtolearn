export const CompanionRole = {
    WARRIOR: 'WARRIOR',
    GUARDIAN: 'GUARDIAN',
    SUPPORT: 'SUPPORT'
} as const;

export type CompanionRole = typeof CompanionRole[keyof typeof CompanionRole];

export const CombatActionBehavior = {
    ATTACK: 'ATTACK',
    DEFEND: 'DEFEND',
    HEAL: 'HEAL',
    SPECIAL: 'SPECIAL'
} as const;

export type CombatActionBehavior = typeof CombatActionBehavior[keyof typeof CombatActionBehavior];

export interface Companion {
    id: string;
    name: string;
    role: CompanionRole;
    description: string;
    combatAction: CombatActionBehavior; // Each companion has ONE ability
    stats: {
        attack?: number;
        defense?: number;
        health?: number;
        speed?: number;
        energy?: number;
        energyCost?: number;
        maxEnergy?: number; // Max energy for this specific companion in combat
        cooldown?: number;
    };
    /** Current upgrade level (1-5) */
    level: number;
    /** Math skill that unlocks/upgrades this companion */
    mathSkill: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fractions' | 'decimals' | 'mixed' | 'word-problems';
    /** XP cost to unlock or upgrade to next level */
    cost: number;
    requirements?: {
        minLevel?: number;
        questId?: number;
    };
    icon?: string; // Placeholder for icon path/name
}

export interface PartySlot {
    id: string;
    name: string;
    equippedCompanionId: string | null;
    isCombatSlot?: boolean; // Marks if this slot is active in combat
}

export type PartyComposition = Record<string, string | null>;

export interface PartyStats {
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    attack: number;
    defense: number;
    speed: number;
}
