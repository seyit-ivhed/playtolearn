export const EncounterPhase = {
    INIT: 'INIT',
    PLAYER_TURN: 'PLAYER_TURN',
    MONSTER_TURN: 'MONSTER_TURN',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT'
} as const;

export type EncounterPhase = typeof EncounterPhase[keyof typeof EncounterPhase];

export interface StatusEffect {
    id: string;
    type: 'BUFF' | 'DEBUFF';
    duration: number; // Rounds remaining
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
    maxShield: number;
    currentShield: number;
    damage?: number;
    specialAbilityId?: string;
    specialAbilityType?: 'DAMAGE' | 'SHIELD' | 'HEAL';
    specialAbilityValue?: number;

    // Visuals
    image?: string;

    // State
    isDead: boolean;
    hasActed: boolean;
    currentSpirit: number; // 0-100
    maxSpirit: number;     // 100
    spiritGain: number;
    isBoss?: boolean;
    statusEffects: StatusEffect[];
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
