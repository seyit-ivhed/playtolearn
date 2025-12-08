import { describe, it, expect, beforeEach } from 'vitest';
import { useAdventureStore } from './adventure.store';
import { AdventureStatus } from '../types/adventure.types';

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

    it('should complete an adventure and unlock the next one', () => {
        const store = useAdventureStore.getState();

        store.completeAdventure('1');

        expect(store.getAdventureStatus('1')).toBe(AdventureStatus.COMPLETED);
        expect(store.getAdventureStatus('2')).toBe(AdventureStatus.AVAILABLE);
    });

    it('should not unlock anything if last adventure is completed', () => {
        const store = useAdventureStore.getState();

        // Fast forward to last adventure (assuming 5 adventures)
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
