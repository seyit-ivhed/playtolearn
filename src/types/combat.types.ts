export const CombatPhase = {
    INIT: 'INIT',
    PLAYER_TURN: 'PLAYER_TURN',
    MONSTER_TURN: 'MONSTER_TURN',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT'
} as const;

export type CombatPhase = typeof CombatPhase[keyof typeof CombatPhase];

export interface CombatUnit {
    id: string; // Unique Instance ID
    templateId: string; // Reference to Companion/Monster ID
    name: string;
    isPlayer: boolean;

    // Stats
    maxHealth: number;
    currentHealth: number;
    maxShield: number;
    currentShield: number;

    // Visuals
    icon: string;
    image?: string;
    color: string;

    // State
    isDead: boolean;
    hasActed: boolean;
}

export interface CombatState {
    phase: CombatPhase;
    turnCount: number;

    // Units
    party: CombatUnit[];
    monsters: CombatUnit[];

    // Selection
    selectedUnitId: string | null;

    // Logs
    // Logs
    combatLog: string[];

    // Special Mechanic
    specialMeter: number; // 0 to 100
}
