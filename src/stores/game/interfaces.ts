export interface EncounterResult {
    stars: number;
    difficulty: number;
    completedAt: number;
}

// State shape only (no actions)
export interface GameState {
    // Progression
    unlockedCompanions: string[]; // IDs
    activeParty: string[]; // IDs (Max 4)
    deviceId: string;

    // Per-Encounter Progression
    encounterResults: Record<string, EncounterResult>; // Key: adventureId_nodeIndex
    activeEncounterDifficulty: number;

    // Progression System
    xpPool: number;
    companionStats: Record<string, { level: number }>;
    authMilestoneReached: boolean;
}

// Adventure & Encounter Management
export interface AdventureProgressSlice {
    completeEncounter: (adventureId: string, nodeIndex: number) => void;
    setEncounterDifficulty: (difficulty: number) => void;
}


// Party & Companion Management
export interface PartyManagementSlice {
    addToParty: (companionId: string) => void;
    removeFromParty: (companionId: string) => void;
    unlockCompanion: (companionId: string) => void;
}

// XP & Leveling
export interface ProgressionSlice {
    addXpToPool: (amount: number) => void;
    levelUpCompanion: (companionId: string) => void;
}

// Debug & Reset Actions
export interface DebugSlice {
    debugUnlockAllCompanions: () => void;
    debugUnlockAllEncounters: () => void;
    debugAddXp: (amount: number) => void;
    debugResetXpPool: () => void;
    debugResetCompanions: () => void;
    debugResetEncounterResults: () => void;
    debugSetCompanionLevel: (companionId: string, level: number) => void;
    debugSetEncounterStars: (adventureId: string, nodeIndex: number, stars: number) => void;
    resetAll: () => void;
}

// Combined store type
export interface GameStore extends GameState, AdventureProgressSlice, PartyManagementSlice, ProgressionSlice, DebugSlice { }
