export const CombatPhase = {
    INIT: 'INIT',
    PLAYER_TURN: 'PLAYER_TURN',
    ENEMY_TURN: 'ENEMY_TURN',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT'
} as const;

export type CombatPhase = typeof CombatPhase[keyof typeof CombatPhase];

export interface CombatUnit {
    id: string; // Unique Instance ID
    templateId: string; // Reference to Companion/Enemy ID
    name: string;
    isPlayer: boolean;

    // Stats
    maxHealth: number;
    currentHealth: number;
    maxEnergy: number; // 0 for enemies usually
    currentEnergy: number;
    maxShield: number;
    currentShield: number;

    // Visuals
    icon: string;
    color: string;

    // State
    isDead: boolean;
}

export interface CombatState {
    phase: CombatPhase;
    turnCount: number;

    // Units
    party: CombatUnit[];
    enemies: CombatUnit[];

    // Selection
    selectedUnitId: string | null;

    // Logs
    combatLog: string[];
}
