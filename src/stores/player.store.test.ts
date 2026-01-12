import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from './player.store';

describe('Player Store', () => {
    beforeEach(() => {
        usePlayerStore.setState({

            language: 'en'
        });
    });

    it('should update language', () => {
        const store = usePlayerStore.getState();
        store.setLanguage('sv');
        expect(usePlayerStore.getState().language).toBe('sv');
    });
});
