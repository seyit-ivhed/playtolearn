export const CombatPhase = {
    PLAYER_INPUT: 'PLAYER_INPUT',
    MATH_CHALLENGE: 'MATH_CHALLENGE',
    PLAYER_ACTION: 'PLAYER_ACTION',
    ENEMY_ACTION: 'ENEMY_ACTION',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT',
} as const;

export type CombatPhase = typeof CombatPhase[keyof typeof CombatPhase];

export type CombatActionType = 'attack' | 'defend' | 'special';

export interface CombatAction {
    type: CombatActionType;
    value?: number; // e.g., damage amount, shield amount
}

export interface ModuleState {
    currentEnergy: number;
    maxEnergy: number;
}

export interface CombatEntity {
    id: string;
    name: string;
    maxHealth: number;
    currentHealth: number;
    maxShield: number;
    currentShield: number;
    modules: {
        attack: ModuleState;
        defend: ModuleState;
        special: ModuleState;
    };
    sprite?: string; // Path to sprite image
}

export interface CombatState {
    phase: CombatPhase;
    turn: number;
    player: CombatEntity;
    enemy: CombatEntity;
    combatLog: string[];
}
