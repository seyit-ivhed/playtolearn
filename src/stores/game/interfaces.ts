export interface EncounterResult {
    stars: number;
    difficulty: number;
    completedAt: number;
}

// State shape only (no actions)
export interface GameState {
    // Progression
    currentMapNode: number; // 1-indexed, relative to current adventure
    activeAdventureId: string;
    unlockedCompanions: string[]; // IDs
    activeParty: string[]; // IDs (Max 4)

    // Per-Encounter Progression
    encounterResults: Record<string, EncounterResult>; // Key: adventureId_nodeIndex
    activeEncounterDifficulty: number;

    // Progression System
    xpPool: number;
    companionStats: Record<string, { level: number; xp: number }>;
    restedCompanions: string[]; // IDs of companions who are rested
}

// Adventure & Encounter Management
export interface AdventureProgressSlice {
    completeEncounter: (nodeIndex?: number) => void;
    setEncounterDifficulty: (difficulty: number) => void;
    setActiveAdventure: (adventureId: string) => void;
    resetMap: () => void;
}

// Party & Companion Management
export interface PartyManagementSlice {
    addToParty: (companionId: string) => void;
    removeFromParty: (companionId: string) => void;
    unlockCompanion: (companionId: string) => void;
}

// XP, Leveling & Rested State
export interface ProgressionSlice {
    addXpToPool: (amount: number) => void;
    assignXpToCompanion: (companionId: string, amount: number) => void;
    levelUpCompanion: (companionId: string) => void;
    consumeRestedBonus: (companionId: string) => void; // Call when bonus used
    markRestedCompanions: () => void; // Call when starting adventure
}

// Debug & Reset Actions
export interface DebugSlice {
    debugSetMapNode: (node: number) => void;
    debugUnlockAllCompanions: () => void;
    debugAddXp: (amount: number) => void;
    debugResetXpPool: () => void;
    debugResetCompanions: () => void;
    debugResetEncounterResults: () => void;
    resetAll: () => void;
}

// Combined store type
export interface GameStore extends GameState, AdventureProgressSlice, PartyManagementSlice, ProgressionSlice, DebugSlice { }
