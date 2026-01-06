import { ADVENTURES } from '../../../data/adventures.data';
import { type AdventureId, AdventureStatus } from '../../../types/adventure.types';
import type { EncounterResult } from '../../../stores/game/interfaces';

/**
 * Finds the highest ranked adventure the player has unlocked.
 * Starts from the end of the ADVENTURES list and returns the first one with AVAILABLE or COMPLETED status.
 * Defaults to 'prologue' if no adventures are unlocked.
 */
export const getHighestUnlockedAdventure = (
    adventureStatuses: Record<AdventureId, AdventureStatus>
): { volumeId: string; adventureId: AdventureId } => {
    // Search backwards through adventures to find the furthest unlocked one
    for (let i = ADVENTURES.length - 1; i >= 0; i--) {
        const adventure = ADVENTURES[i];
        const status = adventureStatuses[adventure.id];
        if (status === AdventureStatus.AVAILABLE || status === AdventureStatus.COMPLETED) {
            return { volumeId: adventure.volumeId || 'origins', adventureId: adventure.id };
        }
    }

    // Default to prologue
    return { volumeId: 'origins', adventureId: 'prologue' };
};

/**
 * Checks if a player has any completed encounters in a specific adventure.
 */
export const hasProgressInAdventure = (
    adventureId: string,
    encounterResults: Record<string, EncounterResult>
): boolean => {
    return Object.keys(encounterResults).some(key => key.startsWith(`${adventureId}_`));
};

/**
 * Returns the index (1-indexed) of the highest completed encounter in an adventure.
 * Returns 0 if none are completed.
 */
export const getMaxCompletedNodeIndex = (
    adventureId: string,
    encounterResults: Record<string, EncounterResult>
): number => {
    let maxIndex = 0;
    const prefix = `${adventureId}_`;

    Object.keys(encounterResults).forEach(key => {
        if (key.startsWith(prefix)) {
            const index = parseInt(key.split('_')[1], 10);
            if (!isNaN(index) && index > maxIndex) {
                maxIndex = index;
            }
        }
    });

    return maxIndex;
};

/**
 * Calculates the focal node for an adventure map.
 * This is usually the encounter right after the highest completed one.
 */
export const getFocalNodeIndex = (
    adventureId: string,
    encounterResults: Record<string, EncounterResult>
): number => {
    const adventure = ADVENTURES.find(a => a.id === adventureId);
    if (!adventure) return 1;

    const maxCompleted = getMaxCompletedNodeIndex(adventureId, encounterResults);

    // If they've completed some, focus on the next one (capped at last node)
    if (maxCompleted > 0) {
        return Math.min(maxCompleted + 1, adventure.encounters.length);
    }

    // If no encounters completed, start at 1
    return 1;
};

/**
 * Checks if a specific node is completed.
 */
export const isNodeCompleted = (
    adventureId: string,
    nodeIndex: number,
    encounterResults: Record<string, EncounterResult>
): boolean => {
    return !!encounterResults[`${adventureId}_${nodeIndex}`];
};

/**
 * Checks if a specific node is unlocked.
 * A node is unlocked if it's the first node OR if the previous node is completed.
 */
export const isNodeLocked = (
    adventureId: string,
    nodeIndex: number,
    encounterResults: Record<string, EncounterResult>
): boolean => {
    if (nodeIndex <= 1) return false;
    return !isNodeCompleted(adventureId, nodeIndex - 1, encounterResults);
};
