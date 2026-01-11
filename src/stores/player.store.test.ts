import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from './player.store';

describe('Player Store', () => {
    beforeEach(() => {
        usePlayerStore.setState({

            language: 'en',
            currentAdventure: 1,
        });
    });

    it('should update language', () => {
        const store = usePlayerStore.getState();
        store.setLanguage('sv');
        expect(usePlayerStore.getState().language).toBe('sv');
    });

    it('should update current adventure', () => {
        const store = usePlayerStore.getState();
        store.setCurrentAdventure(3);
        expect(usePlayerStore.getState().currentAdventure).toBe(3);
    });
});
