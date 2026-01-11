import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from './player.store';

describe('Player Store', () => {
    beforeEach(() => {
        usePlayerStore.setState({

            language: 'en',
            currentAdventure: 1,
            unlockedAdventures: [1],
        });
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
});
