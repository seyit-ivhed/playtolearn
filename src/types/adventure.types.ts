// Adventure: A self-contained story arc with its own theme, map, and series of encounters
export type AdventureId = string;

export const AdventureStatus = {
    LOCKED: 'LOCKED',
    AVAILABLE: 'AVAILABLE',
    COMPLETED: 'COMPLETED'
} as const;

export type AdventureStatus = typeof AdventureStatus[keyof typeof AdventureStatus];

// Encounter Types (for future expansion)
export const EncounterType = {
    BATTLE: 'BATTLE',      // Turn-based combat against monsters
    PUZZLE: 'PUZZLE',      // Logic and math puzzles (future feature)
    BOSS: 'BOSS',          // Boss fight at the end of an adventure
    ENDING: 'ENDING'       // Transition node to next adventure
} as const;

export type EncounterType = typeof EncounterType[keyof typeof EncounterType];

// Monster encountered in battle encounters
export interface AdventureMonster {
    id: string;
    name?: string;
    maxHealth: number;
    attack: number;

    sprite?: string;
    icon?: string;
    isBoss?: boolean;
}

// Map coordinates for placing nodes
export interface MapCoordinates {
    x: number;
    y: number;
}

// Puzzle Types
export const PuzzleType = {
    REFILL_CANTEEN: 'REFILL_CANTEEN',
    BALANCE: 'BALANCE',
    SEQUENCE: 'SEQUENCE',
    SYMMETRY: 'SYMMETRY',
    LATIN_SQUARE: 'LATIN_SQUARE',
    NUMBER_PATH: 'NUMBER_PATH'
} as const;

export type PuzzleType = typeof PuzzleType[keyof typeof PuzzleType];

export interface PuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
    instruction?: string;
}

export interface PuzzleOption {
    value: number;
    type: 'ADD' | 'MULTIPLY';
    label?: string; // e.g. "x2", "+5"
}


export interface BasePuzzleConfig {
    puzzleType: PuzzleType;
}

export interface RefillCanteenConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.REFILL_CANTEEN;
    targetValue?: number;
    options?: (number | PuzzleOption)[];
}

export interface BalanceConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.BALANCE;
    leftOptions?: (number | PuzzleOption)[];
    rightOptions?: (number | PuzzleOption)[];
    initialLeftWeight?: number;
    initialRightWeight?: number;
}

export interface SequenceConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.SEQUENCE;
    targetValue?: number;
    options?: (number | PuzzleOption)[];
    rules?: string[];
}

export interface SymmetryConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.SYMMETRY;
    targetValue?: number; // Used for gridSize
    leftOptions?: (number | PuzzleOption)[];
    rightOptions?: (number | PuzzleOption)[];
}

export interface LatinSquareConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.LATIN_SQUARE;
    options?: (number | PuzzleOption)[];
    rules?: string[];
}

export interface NumberPathConfig extends BasePuzzleConfig {
    puzzleType: typeof PuzzleType.NUMBER_PATH;
    gridSize?: number;
    startValue?: number;
    stepValue?: number;
    preFilledIndices?: { row: number; col: number; value: number }[];
}

export type PuzzleConfig =
    | RefillCanteenConfig
    | BalanceConfig
    | SequenceConfig
    | SymmetryConfig
    | LatinSquareConfig
    | NumberPathConfig;

export interface BasePuzzleData {
    puzzleType: PuzzleType;
}

export interface RefillCanteenData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.REFILL_CANTEEN;
    targetValue: number;
    options: (number | PuzzleOption)[];
}

export interface Weight {
    id: string;
    value: number;
    isHeavy: boolean;
}

export interface BalanceData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.BALANCE;
    targetValue: number; // The target balance sum
    options: (number | PuzzleOption)[];
    leftStack: Weight[];
    rightStack: Weight[];
    targetBalance: number;
}

export interface SequenceData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.SEQUENCE;
    targetValue: number;
    options: (number | PuzzleOption)[];
    rules: string[];
}

export interface SymmetryGridCell {
    x: number;
    y: number;
    isActive: boolean;
}

export interface SymmetryData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.SYMMETRY;
    targetValue: number; // gridSize
    options: (number | PuzzleOption)[];
    leftOptions: SymmetryGridCell[];
    rightOptions: SymmetryGridCell[];
}

export type LatinSquareElement = 'FIRE' | 'WATER' | 'EARTH' | 'AIR' | null;

export interface LatinSquareData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.LATIN_SQUARE;
    targetValue: number; // gridSize
    grid: LatinSquareElement[][];
    fixedIndices: { row: number; col: number }[];
}

export interface NumberPathData extends BasePuzzleData {
    puzzleType: typeof PuzzleType.NUMBER_PATH;
    gridSize: number;
    startValue: number;
    stepValue: number;
    preFilledIndices: { row: number; col: number; value: number }[];
    targetValue: number; // totalCells
}

export type PuzzleData =
    | RefillCanteenData
    | BalanceData
    | SequenceData
    | SymmetryData
    | LatinSquareData
    | NumberPathData;

// Concept: An encounter is a single node on the map
export interface Encounter {
    id: string;
    type: EncounterType;
    label?: string;
    coordinates?: MapCoordinates;
    enemies?: AdventureMonster[]; // If type is BATTLE or BOSS
    puzzleData?: PuzzleConfig;       // If type is PUZZLE
    unlocksCompanion?: string;      // Companion ID that joins when this encounter is started

    storyBeat?: {
        text?: string;
        speaker?: string;
    };
}

// Adventure: Contains a linear sequence of encounters culminating in a boss fight
export interface Adventure {
    id: AdventureId;
    title?: string;
    storyHook?: string;   // Narrative hook for the storybook page
    completionSummary?: string; // Summary shown after completion
    illustration?: string; // Thumbnail/Illustration for the storybook page
    mapImage?: string;     // The background image for the adventure map
    volumeId?: string;    // The volume (realm) this adventure belongs to
    encounters: Encounter[]; // The sequence of nodes for this adventure
    levelRange?: [number, number]; // Recommended level range [min, max]
    requirements?: {
        minLevel?: number;
        previousAdventureId?: AdventureId;
    };
}

export type VolumeId = string;

export interface Volume {
    id: VolumeId;
    title: string;
    description: string;
    coverImage?: string;
    isLocked: boolean;
    price?: number;
}

