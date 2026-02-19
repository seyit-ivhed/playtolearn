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

export * from './puzzle.types';
import type { PuzzleConfig } from './puzzle.types';

// Concept: An encounter is a single node on the map
export interface Encounter {
    id: string;
    type: EncounterType;
    label?: string;
    coordinates?: MapCoordinates;
    enemies?: AdventureMonster[]; // If type is BATTLE or BOSS
    puzzleData?: PuzzleConfig;       // If type is PUZZLE
    combatMusic?: string;           // Optional specific music for this encounter
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

    // Background Music
    mapMusic?: string;     // Music played during map exploration and puzzles
    combatMusic?: string;  // Music played during combat encounters

    // The sequence of nodes for this adventure
    encounters: Encounter[];
    levelRange?: [number, number]; // Recommended level range [min, max]
    requirements?: {
        minLevel?: number;
        previousAdventureId?: AdventureId;
    };
}
