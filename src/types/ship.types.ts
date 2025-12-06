export const ModuleType = {
    WEAPON: 'WEAPON',
    SUPPORT: 'SUPPORT',
    CORE: 'CORE'
} as const;

export type ModuleType = typeof ModuleType[keyof typeof ModuleType];

export const CombatActionBehavior = {
    ATTACK: 'ATTACK',
    DEFEND: 'DEFEND',
    HEAL: 'HEAL',
    SPECIAL: 'SPECIAL'
} as const;

export type CombatActionBehavior = typeof CombatActionBehavior[keyof typeof CombatActionBehavior];

export interface ShipModule {
    id: string;
    name: string;
    type: ModuleType;
    description: string;
    combatAction?: CombatActionBehavior; // Defines what this module does in combat
    stats: {
        attack?: number;
        defense?: number;
        health?: number;
        speed?: number;
        energy?: number;
        energyCost?: number;
        maxEnergy?: number; // Max energy for this specific module in combat
        cooldown?: number;
    };
    cost: number;
    requirements?: {
        minLevel?: number;
        missionId?: number;
    };
    icon?: string; // Placeholder for icon path/name
}

export interface ShipSlot {
    id: string;
    type: ModuleType;
    name: string;
    allowedTypes: ModuleType[];
    equippedModuleId: string | null;
    isCombatSlot?: boolean; // Marks if this slot is active in combat
}

export type ShipLoadout = Record<string, string | null>;

export interface ShipStats {
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    attack: number;
    defense: number;
    speed: number;
}
