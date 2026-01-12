import { describe, it, expect, vi } from 'vitest';
import type { StoreApi } from 'zustand';
import { createAdventureProgressSlice } from './adventure-progress.slice';
import { ADVENTURES } from '../../../data/adventures.data';
import { EncounterType } from '../../../types/adventure.types';
import type { GameStore, EncounterResult } from '../interfaces';

// Mock get() function for Zustand
const mockGet = (state: Partial<GameStore>) => () => state as GameStore;
const mockSet = vi.fn() as unknown as StoreApi<GameStore>['setState'];

describe('adventure-progress.slice - getAdventureNodes', () => {
    // Helper to setup slice
    const setupSlice = (encounterResults: Record<string, EncounterResult> = {}) => {
        const slice = createAdventureProgressSlice(
            mockSet,
            mockGet({ encounterResults, activeEncounterDifficulty: 1 }),
            {} as StoreApi<GameStore>
        );
        return slice;
    };

    // Helper to mock adventure data if needed, or use real data.
    // We will use real ADVENTURES data but select the first one for stability.
    const adventureId = ADVENTURES[0].id; // 'adventure-1' usually

    it('should return all nodes locked except the first one initially', () => {
        const slice = setupSlice({});
        const nodes = slice.getAdventureNodes(adventureId); // Use a known adventure ID like 'chapter-1'

        expect(nodes[0].isLocked).toBe(false); // First node always unlocked
        expect(nodes[1].isLocked).toBe(true);  // Second node locked
    });

    it('should unlock the next node when the first is completed with stars', () => {
        const firstNodeKey = `${adventureId}_1`;
        const encounterResults = {
            [firstNodeKey]: { stars: 3, difficulty: 1, completedAt: 123 }
        };
        const slice = setupSlice(encounterResults);
        const nodes = slice.getAdventureNodes(adventureId);

        expect(nodes[0].isLocked).toBe(false);
        expect(nodes[0].stars).toBe(3);
        
        // Node 2 should now be unlocked because Node 1 is done
        expect(nodes[1].isLocked).toBe(false);
        
        // Node 3 should still be locked
        expect(nodes[2].isLocked).toBe(true);
    });

    it('should keep completed nodes unlocked even if they are not the latest', () => {
        // Scenario: User completed Node 1, 2, 3.
        // We check if Node 2 is unlocked.
        const encounterResults = {
            [`${adventureId}_1`]: { stars: 3, difficulty: 1, completedAt: 123 },
            [`${adventureId}_2`]: { stars: 2, difficulty: 1, completedAt: 124 },
            [`${adventureId}_3`]: { stars: 1, difficulty: 1, completedAt: 125 },
        };
        const slice = setupSlice(encounterResults);
        const nodes = slice.getAdventureNodes(adventureId);

        expect(nodes[1].isLocked).toBe(false);
        expect(nodes[1].stars).toBe(2);
    });

    it('should unlock a node if the previous node was a Camp and the one before that was completed', () => {
         // This depends on the specific adventure structure. 
         // Let's assume adventure-1 has a Camp at index 2 (node 3) for example?
         // Converting to generic test might be hard without mocking ADVENTURES.
         // Let's mock ADVENTURES by temporarily overriding it or just finding a camp.
         
         const adventureWithCamp = ADVENTURES.find(a => a.encounters.some(e => e.type === EncounterType.CAMP));
         if (!adventureWithCamp) return; // Skip if no camp found in data

         const campIndex = adventureWithCamp.encounters.findIndex(e => e.type === EncounterType.CAMP);
         const prevIndex = campIndex - 1;
         
         if (prevIndex < 0) return; // Camp is first? Unlikely.

         const prevNodeKey = `${adventureWithCamp.id}_${prevIndex + 1}`;
         const encounterResults = {
             [prevNodeKey]: { stars: 3, difficulty: 1, completedAt: 123 }
         };

         const slice = setupSlice(encounterResults);
         const nodes = slice.getAdventureNodes(adventureWithCamp.id);

         // Camp itself should be unlocked
         expect(nodes[campIndex].isLocked).toBe(false);
         
         // The node AFTER the camp should also be unlocked because the camp "passes through" the unlock status of the previous completed node
         // OR does camp need to be "completed"? 
         // Our logic: 
         // if (node.type !== EncounterType.CAMP) lastUnlockedNodeCompleted = isCompleted;
         // So for Camp, lastUnlockedNodeCompleted remains whatever it was (True from prev node).
         // So next node sees lastUnlockedNodeCompleted = True.
         
         const nextIndex = campIndex + 1;
         if (nextIndex < nodes.length) {
             expect(nodes[nextIndex].isLocked).toBe(false);
         }
    });

    it('should correct the bug: Replaying Node 1 should not lock Node 3 if Node 2 is completed', () => {
        // This was the original bug. simpler logic: if a node has stars, it is unlocked.
        // If I have stars on Node 3, it must be unlocked regardless of what I am doing at Node 1.
        
        const node3Key = `${adventureId}_3`;
        const encounterResults = {
            [node3Key]: { stars: 3, difficulty: 1, completedAt: 123 }
        };
        // Node 1 and 2 not completed (simulated weird state or just focused checking)
        // Actually to have Node 3 completed, normally Node 1 and 2 are done.
        // But let's say I reset Node 1? No, results persist.
        // The bug was visual: "all the encounters after the next one looks locked".
        // With our logic: `isLocked = !isCompleted && !lastUnlockedNodeCompleted`
        // For Node 3: isCompleted=true. So !isCompleted is false. isLocked becomes false.
        // So Node 3 depends ONLY on itself if it is completed.
        
        const slice = setupSlice(encounterResults);
        const nodes = slice.getAdventureNodes(adventureId);
        
        expect(nodes[2].isLocked).toBe(false);
    });
});
