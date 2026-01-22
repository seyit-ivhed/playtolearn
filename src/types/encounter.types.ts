export const EncounterPhase = {
    INIT: 'INIT',
    PLAYER_TURN: 'PLAYER_TURN',
    MONSTER_TURN: 'MONSTER_TURN',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT'
} as const;

export type EncounterPhase = typeof EncounterPhase[keyof typeof EncounterPhase];

export interface CombatLog {
    message: string;
    type: 'ATTACK' | 'ABILITY' | 'EFFECT' | 'INFO';
}

/**
 * Generic interface for combat participants
 */
export interface BattleUnit {
    id: string;
    templateId: string;
    name: string;
    isPlayer: boolean;
    damage?: number;
    currentHealth: number;
    maxHealth: number;
    isDead: boolean;

    // Stats
    maxSpirit: number;
    currentSpirit: number;
    spiritGain: number;

    // State
    hasActed: boolean;
}

export interface EncounterUnit {
    id: string; // Unique Instance ID
    templateId: string; // Reference to Companion/Monster ID
    name: string;
    title?: string;
    isPlayer: boolean;

    // Stats
    maxHealth: number;
    currentHealth: number;
    damage?: number;
    specialAbilityId?: string;
    specialAbilityVariables?: Record<string, number>;

    // Visuals
    image?: string;

    // State
    isDead: boolean;
    hasActed: boolean;
    currentSpirit: number; // 0-100
    maxSpirit: number;     // 100
    spiritGain: number;
    isBoss?: boolean;
}

export interface EncounterState {
    phase: EncounterPhase;
    turnCount: number;

    // Units
    party: EncounterUnit[];
    monsters: EncounterUnit[];

    // Selection
    selectedUnitId: string | null;

    // Logs
    encounterLog: string[];

    // Rewards
    xpReward: number;

    // Progression
    nodeIndex?: number;
    difficulty?: number; // 1-5
}
