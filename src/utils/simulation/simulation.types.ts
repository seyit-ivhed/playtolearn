/**
 * Battle Simulation Types
 */

export const UltimateStrategy = {
    ALL_SUCCESS: 'ALL_SUCCESS',
    ALL_FAIL: 'ALL_FAIL',
    RANDOM: 'RANDOM'
} as const;

export type UltimateStrategy = typeof UltimateStrategy[keyof typeof UltimateStrategy];

export interface SimulationUnit {
    id: string;
    templateId: string;
    name: string;
    isPlayer: boolean;

    // Stats
    maxHealth: number;
    currentHealth: number;
    damage: number;
    specialAbilityId?: string;
    specialAbilityVariables?: Record<string, number>;

    // State
    isDead: boolean;
    hasActed: boolean;
    currentSpirit: number;
    maxSpirit: number;
    spiritGain: number;
}

export interface BattleState {
    turnCount: number;
    party: SimulationUnit[];
    monsters: SimulationUnit[];
    isVictory: boolean;
    isDefeat: boolean;
}

export interface SimulationResult {
    victory: boolean;
    turnCount: number;
    finalPartyHealth: number;
    finalMonsterHealth: number;
}

export interface EncounterSimulationResults {
    encounterId: string;
    winRateAllSuccess: number;
    winRateAllFail: number;
    winRateRandom: number;

    // Detailed metrics
    allSuccessDetails: {
        wins: number;
        total: number;
        averageTurns: number;
    };
    allFailDetails: {
        wins: number;
        total: number;
        averageTurns: number;
    };
    randomDetails: {
        wins: number;
        total: number;
        averageTurns: number;
    };
}

export interface PartyMemberConfig {
    companionId: string;
    level: number;
}

export interface EncounterConfig {
    party: PartyMemberConfig[];
}

export interface AdventureSimulationConfig {
    adventureId: string;
    encounters: Record<string, EncounterConfig>;
}

export type SimulationConfigFile = AdventureSimulationConfig | AdventureSimulationConfig[];
