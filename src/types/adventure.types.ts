// Adventure: A self-contained story arc with its own theme, map, and series of encounters
export type AdventureId = string;

export const AdventureStatus = {
    LOCKED: 'LOCKED',
    AVAILABLE: 'AVAILABLE',
    COMPLETED: 'COMPLETED'
} as const;

export type AdventureStatus = typeof AdventureStatus[keyof typeof AdventureStatus];

// Rewards for completing an adventure (either new companion or companion growth)
export interface AdventureReward {
    unlocksCompanionId?: string; // New companion joins the party
    companionGrowth?: string; // Existing companion ID that experiences growth
    xp?: number;
    currency?: number;
}

// Encounter Types (for future expansion)
export const EncounterType = {
    BATTLE: 'BATTLE',      // Turn-based combat against monsters
    PUZZLE: 'PUZZLE',      // Logic and math puzzles (future feature)
    BOSS: 'BOSS',          // Boss fight at the end of an adventure
    CAMP: 'CAMP'           // Rest stop to adjust party
} as const;

export type EncounterType = typeof EncounterType[keyof typeof EncounterType];

// Monster encountered in battle encounters
export interface AdventureMonster {
    id: string;
    name?: string;
    maxHealth: number;
    maxShield?: number;
    attack: number;
    defense: number;

    sprite?: string;
    icon?: string;
}

// Map coordinates for placing nodes
export interface MapCoordinates {
    x: number;
    y: number;
}

// Puzzle Types
export const PuzzleType = {
    SUM_TARGET: 'SUM_TARGET',     // Water Flow
    BALANCE: 'BALANCE',           // Weighing Rocks
    SEQUENCE: 'SEQUENCE'          // Star Map
} as const;

export type PuzzleType = typeof PuzzleType[keyof typeof PuzzleType];

export interface PuzzleOption {
    value: number;
    type: 'ADD' | 'MULTIPLY' | 'DIVIDE';
    label?: string; // e.g. "x2", "+5", "÷3"
}


export interface PuzzleConfig {
    puzzleType: PuzzleType;
    // Optional overrides for static puzzles (tutorials, etc)
    targetValue?: number;
    options?: (number | PuzzleOption)[];
    leftOptions?: (number | PuzzleOption)[];
    rightOptions?: (number | PuzzleOption)[];
    rules?: string[];
    initialLeftWeight?: number;
    initialRightWeight?: number;
}

export interface PuzzleData extends Required<Pick<PuzzleConfig, 'puzzleType'>> {
    targetValue: number;
    options: (number | PuzzleOption)[];
    leftOptions?: (number | PuzzleOption)[];
    rightOptions?: (number | PuzzleOption)[];
    rules?: string[];
    initialLeftWeight?: number;
    initialRightWeight?: number;
}

// Concept: An encounter is a single node on the map
export interface Encounter {
    id: string;
    type: EncounterType;
    label?: string;
    coordinates?: MapCoordinates;
    enemies?: AdventureMonster[]; // If type is BATTLE or BOSS
    puzzleData?: PuzzleConfig;       // If type is PUZZLE
    storyBeat?: {
        text?: string;
        speaker?: string;
    };
}

// Adventure: Contains a linear sequence of encounters culminating in a boss fight
export interface Adventure {
    id: AdventureId;
    title?: string;
    description?: string;
    difficulty: number; // 1-10 scale
    encounters: Encounter[]; // The sequence of nodes for this adventure
    rewards: AdventureReward;
    requirements?: {
        minLevel?: number;
        previousAdventureId?: AdventureId;
    };
}
