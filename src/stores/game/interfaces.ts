export interface EncounterResult {
    stars: number;
    difficulty: number;
    completedAt: number;
}

// State shape only (no actions)
export interface GameState {
    activeParty: string[];
    encounterResults: Record<string, EncounterResult>;
    activeEncounterDifficulty: number;
    xpPool: number;
    companionStats: Record<string, { level: number }>;
}

// Adventure & Encounter Management
export interface AdventureProgressSlice {
    completeEncounter: (adventureId: string, nodeIndex: number) => void;
    setEncounterDifficulty: (difficulty: number) => void;
}


// XP & Leveling
export interface ProgressionSlice {
    addXpToPool: (amount: number) => void;
    levelUpCompanion: (companionId: string) => void;
}

// Debug & Reset Actions
export interface DebugSlice {
    debugAddXp: (amount: number) => void;
    debugResetXpPool: () => void;
    debugResetCompanions: () => void;
    debugResetEncounterResults: () => void;
    debugSetCompanionLevel: (companionId: string, level: number) => void;
    debugSetEncounterStars: (adventureId: string, nodeIndex: number, stars: number) => void;
}

// Combined store type
export interface GameStore extends GameState, AdventureProgressSlice, ProgressionSlice, DebugSlice { }
