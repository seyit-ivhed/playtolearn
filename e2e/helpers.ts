import type { Page } from '@playwright/test';

const GAME_STORE_KEY = 'playtolearn-game-store';

/**
 * Intercepts Supabase auth API calls so tests work without a live Supabase instance.
 * Even with a fake VITE_SUPABASE_URL, some refreshSession calls may fire if a
 * stored session exists. This interception ensures those calls return cleanly.
 */
export async function interceptSupabaseAuth(page: Page): Promise<void> {
    await page.route('**/auth/v1/**', (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: { session: null, user: null }, error: null }),
        });
    });
}

/**
 * Seeds the Zustand game store in localStorage before the page loads.
 * Call this via page.addInitScript() so it runs before any JS.
 */
export function buildGameStateScript(partial: {
    encounterResults?: Record<string, { stars: number; difficulty: number; completedAt: number }>;
    adventureStatuses?: Record<string, string>;
    activeEncounterDifficulty?: number;
}): string {
    const state = {
        activeParty: ['lyra', 'kaelen', 'torvin'],
        encounterResults: partial.encounterResults ?? {},
        activeEncounterDifficulty: partial.activeEncounterDifficulty ?? 1,
        companionStats: {},
        adventureStatuses: partial.adventureStatuses ?? { '1': 'AVAILABLE' },
    };
    return `localStorage.setItem('${GAME_STORE_KEY}', JSON.stringify({ state: ${JSON.stringify(state)}, version: 0 }));`;
}
