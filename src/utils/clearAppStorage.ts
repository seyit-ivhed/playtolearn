import { PLAYER_STORE_KEY, GAME_STORE_KEY, SESSION_ID_KEY, ATTRIBUTION_KEY } from '../stores/storage-keys';

/**
 * Clears all app-related data from localStorage and sessionStorage.
 * Should be called after a successful account deletion to prevent stale
 * data from causing broken state on the next app load.
 */
export function clearAppStorage(): void {
    localStorage.removeItem(PLAYER_STORE_KEY);
    localStorage.removeItem(GAME_STORE_KEY);

    // Clear Supabase auth token (key pattern: sb-{projectRef}-auth-token)
    const authTokenKeys = Object.keys(localStorage).filter(
        key => key.startsWith('sb-') && key.endsWith('-auth-token')
    );
    authTokenKeys.forEach(key => localStorage.removeItem(key));

    sessionStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem(ATTRIBUTION_KEY);
}
