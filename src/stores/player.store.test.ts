import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from './player.store';

describe('Player Store', () => {
    beforeEach(() => {
        usePlayerStore.setState({

            difficulty: 1,
            language: 'en',
            currentAdventure: 1,
            unlockedAdventures: [1],
        });
    });



    it('should update difficulty', () => {
        const store = usePlayerStore.getState();
        store.setDifficulty(5);
        expect(usePlayerStore.getState().difficulty).toBe(5);
    });

    it('should update language', () => {
        const store = usePlayerStore.getState();
        store.setLanguage('sv');
        expect(usePlayerStore.getState().language).toBe('sv');
    });

    it('should unlock a new adventure', () => {
        const store = usePlayerStore.getState();
        store.unlockAdventure(2);
        expect(usePlayerStore.getState().unlockedAdventures).toEqual([1, 2]);
    });

    it('should not duplicate unlocked adventures', () => {
        const store = usePlayerStore.getState();
        store.unlockAdventure(1); // Already unlocked in beforeEach
        expect(usePlayerStore.getState().unlockedAdventures).toEqual([1]);
    });

    it('should update current adventure', () => {
        const store = usePlayerStore.getState();
        store.setCurrentAdventure(3);
        expect(usePlayerStore.getState().currentAdventure).toBe(3);
    });

    it('should reset progress but keep settings', () => {
        // Set up some non-default state
        usePlayerStore.setState({

            difficulty: 4, // Hero
            language: 'sv', // Swedish
            currentAdventure: 2,
            unlockedAdventures: [1, 2],
        });

        const store = usePlayerStore.getState();
        expect(store.currentAdventure).toBe(2);
        expect(store.difficulty).toBe(4);
        expect(store.language).toBe('sv');

        // Reset
        store.resetProgress();

        const resetStore = usePlayerStore.getState();

        // Progress should be reset
        expect(resetStore.currentAdventure).toBe(1);
        expect(resetStore.unlockedAdventures).toEqual([1]);


        // Settings should be preserved
        expect(resetStore.difficulty).toBe(4);
        expect(resetStore.language).toBe('sv');
    });
});
