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

// Runtime instance of a companion in combat
export interface CompanionInstance {
    companionId: string; // Reference to Companion
    slotId: string; // Which slot it's equipped in
    currentEnergy: number;
    maxEnergy: number;
    combatAction: string; // Will be CombatActionBehavior value
}

export interface CombatAction {
    companionId: string; // Which companion is performing the action
    behavior: string; // CombatActionBehavior - what action this performs
    value?: number; // e.g., damage amount, shield amount
}

export interface CompanionState {
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
    equippedCompanions: CompanionInstance[]; // Dynamic array of equipped companions
    companions: { // Legacy - kept for backward compatibility during migration
        attack: CompanionState;
        defend: CompanionState;
        special: CompanionState;
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
