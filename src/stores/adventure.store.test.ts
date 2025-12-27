import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAdventureStore } from './adventure.store';
import { AdventureStatus } from '../types/adventure.types';

// Mock the adventures data
vi.mock('../data/adventures.data', () => ({
    ADVENTURES: [
        { id: '1', difficulty: 1, encounters: [] },
        { id: '2', difficulty: 1, encounters: [] },
        { id: '3', difficulty: 1, encounters: [] },
        { id: '4', difficulty: 1, encounters: [] },
        { id: '5', difficulty: 1, encounters: [] },
    ]
}));

describe('AdventureStore', () => {
    beforeEach(() => {
        useAdventureStore.getState().resetProgress();
    });

    it('should initialize with adventure 1 available', () => {
        const status = useAdventureStore.getState().getAdventureStatus('1');
        expect(status).toBe(AdventureStatus.AVAILABLE);
    });

    it('should have other adventures locked initially', () => {
        const status = useAdventureStore.getState().getAdventureStatus('2');
        expect(status).toBe(AdventureStatus.LOCKED);
    });

    it('should unlock all adventures via debug action', () => {
        useAdventureStore.getState().debugUnlockAllAdventures();
        const statuses = useAdventureStore.getState().adventureStatuses;
        ['1', '2', '3', '4', '5'].forEach(id => {
            expect(statuses[id]).toBe(AdventureStatus.AVAILABLE);
        });
    });

    it('should complete an adventure and unlock the next one', () => {
        const store = useAdventureStore.getState();

        store.completeAdventure('1');

        expect(store.getAdventureStatus('1')).toBe(AdventureStatus.COMPLETED);
        expect(store.getAdventureStatus('2')).toBe(AdventureStatus.AVAILABLE);
    });

    it('should not unlock anything if last adventure is completed', () => {
        const store = useAdventureStore.getState();

        // Unlock up to 5
        store.unlockAdventure('5');
        store.completeAdventure('5');

        expect(store.getAdventureStatus('5')).toBe(AdventureStatus.COMPLETED);
        // No crash, no side effects
    });

    it('should return all available adventures', () => {
        const store = useAdventureStore.getState();

        store.completeAdventure('1'); // 1 completed, 2 available

        const available = store.getAvailableAdventures();
        expect(available).toContain('1');
        expect(available).toContain('2');
        expect(available).not.toContain('3');
    });
});
