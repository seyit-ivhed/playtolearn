export type AdventureId = string;

export const AdventureStatus = {
    LOCKED: 'LOCKED',
    AVAILABLE: 'AVAILABLE',
    COMPLETED: 'COMPLETED'
} as const;

export type AdventureStatus = typeof AdventureStatus[keyof typeof AdventureStatus];

export interface AdventureReward {
    unlocksCompanionId?: string;
    xp?: number;
    currency?: number;
}

export interface AdventureMonster {
    id: string;
    name: string;
    maxHealth: number;
    maxShield?: number;
    attack: number;
    defense: number;
    speed: number;
    sprite?: string; // Placeholder
}

export interface Adventure {
    id: AdventureId;
    title: string;
    description: string;
    difficulty: number; // 1-10 scale?
    enemy: AdventureMonster;
    rewards: AdventureReward;
    requirements?: {
        minLevel?: number;
        previousAdventureId?: AdventureId;
    };
}
