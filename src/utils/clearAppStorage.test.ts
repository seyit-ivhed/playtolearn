import { describe, it, expect, beforeEach } from 'vitest';
import { clearAppStorage } from './clearAppStorage';
import { PLAYER_STORE_KEY, GAME_STORE_KEY, SESSION_ID_KEY, ATTRIBUTION_KEY } from '../stores/storage-keys';

describe('clearAppStorage', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    it('removes the player store key from localStorage', () => {
        localStorage.setItem(PLAYER_STORE_KEY, '{"state":{}}');
        clearAppStorage();
        expect(localStorage.getItem(PLAYER_STORE_KEY)).toBeNull();
    });

    it('removes the game store key from localStorage', () => {
        localStorage.setItem(GAME_STORE_KEY, '{"state":{}}');
        clearAppStorage();
        expect(localStorage.getItem(GAME_STORE_KEY)).toBeNull();
    });

    it('removes supabase auth token keys from localStorage', () => {
        localStorage.setItem('sb-abcdefg-auth-token', '{"access_token":"tok"}');
        localStorage.setItem('sb-zzzzzzz-auth-token', '{"access_token":"tok2"}');
        clearAppStorage();
        expect(localStorage.getItem('sb-abcdefg-auth-token')).toBeNull();
        expect(localStorage.getItem('sb-zzzzzzz-auth-token')).toBeNull();
    });

    it('does not remove unrelated localStorage keys', () => {
        localStorage.setItem('unrelated-key', 'value');
        clearAppStorage();
        expect(localStorage.getItem('unrelated-key')).toBe('value');
    });

    it('removes the session ID key from sessionStorage', () => {
        sessionStorage.setItem(SESSION_ID_KEY, 'abc-123');
        clearAppStorage();
        expect(sessionStorage.getItem(SESSION_ID_KEY)).toBeNull();
    });

    it('removes the attribution key from sessionStorage', () => {
        sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify({ source: 'test' }));
        clearAppStorage();
        expect(sessionStorage.getItem(ATTRIBUTION_KEY)).toBeNull();
    });

    it('does not remove unrelated sessionStorage keys', () => {
        sessionStorage.setItem('other-session-key', 'keep-me');
        clearAppStorage();
        expect(sessionStorage.getItem('other-session-key')).toBe('keep-me');
    });

    it('handles empty storage gracefully without throwing', () => {
        expect(() => clearAppStorage()).not.toThrow();
    });
});
