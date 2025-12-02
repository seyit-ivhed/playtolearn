export type MissionId = string;

export const MissionStatus = {
    LOCKED: 'LOCKED',
    AVAILABLE: 'AVAILABLE',
    COMPLETED: 'COMPLETED'
} as const;

export type MissionStatus = typeof MissionStatus[keyof typeof MissionStatus];

export interface MissionReward {
    unlocksModuleId?: string;
    xp?: number;
    currency?: number;
}

export interface MissionEnemy {
    id: string;
    name: string;
    maxHealth: number;
    maxShield?: number;
    attack: number;
    defense: number;
    speed: number;
    sprite?: string; // Placeholder
}

export interface Mission {
    id: MissionId;
    title: string;
    description: string;
    difficulty: number; // 1-10 scale?
    enemy: MissionEnemy;
    rewards: MissionReward;
    requirements?: {
        minLevel?: number;
        previousMissionId?: MissionId;
    };
}
