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
    /** Current growth level (1-5) - companions learn and gain experience */
    level: number;
    /** Math skill that unlocks this companion or grants companion growth */
    mathSkill: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fractions' | 'decimals' | 'mixed' | 'word-problems';
    /** XP cost to unlock or achieve next growth level */
    cost: number;
    requirements?: {
        minLevel?: number;
        adventureId?: string; // Adventure that must be completed
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
