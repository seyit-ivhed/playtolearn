export const ModuleType = {
    WEAPON: 'WEAPON',
    SUPPORT: 'SUPPORT',
    CORE: 'CORE'
} as const;

export type ModuleType = typeof ModuleType[keyof typeof ModuleType];


export interface ShipModule {
    id: string;
    name: string;
    type: ModuleType;
    description: string;
    stats: {
        attack?: number;
        defense?: number;
        health?: number;
        speed?: number;
        energy?: number;
        energyCost?: number;
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
