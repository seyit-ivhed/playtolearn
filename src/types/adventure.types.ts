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
    SUM_TARGET: 'SUM_TARGET',     // Water Flow
    BALANCE: 'BALANCE',           // Weighing Rocks
    SEQUENCE: 'SEQUENCE',          // Star Map
    GUARDIAN_TRIBUTE: 'GUARDIAN_TRIBUTE', // Adventure 2: Division/Distribution
    SYMMETRY: 'SYMMETRY',         // Adventure 3: Mirror Mist
    LATIN_SQUARE: 'LATIN_SQUARE',  // Adventure 3: Keystone Cipher
    GEOMETRY: 'GEOMETRY'          // Adventure 4: Shape Identification
} as const;

export type PuzzleType = typeof PuzzleType[keyof typeof PuzzleType];

export interface PuzzleOption {
    value: number;
    type: 'ADD' | 'MULTIPLY';
    label?: string; // e.g. "x2", "+5"
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
    // Guardian Tribute specific fields
    guardians?: unknown[]; // Actual type defined in guardian-tribute.ts to avoid circular dependency
    totalGems?: number;
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
    description?: string; // Short description
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

