import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/map/1');
        await expect(page).toHaveURL('/map/1');
    });

    test('should navigate between Map and Camp', async ({ page }) => {
        // Assert Map ID
        await expect(page.getByTestId('map-title')).toBeVisible();

        // 1. Hack the state to unlock Node 4 (Camp)
        await page.evaluate(() => {
            const storageKey = 'math-quest-fantasy-storage-v1';
            const currentData = localStorage.getItem(storageKey);
            const parsed = currentData ? JSON.parse(currentData) : { state: {} };

            // Mark encounters 1-3 as completed to unlock node 4
            parsed.state = {
                ...parsed.state,
                encounterResults: {
                    ...parsed.state.encounterResults,
                    '1_1': { stars: 3, difficulty: 1, completedAt: Date.now() },
                    '1_2': { stars: 3, difficulty: 1, completedAt: Date.now() },
                    '1_3': { stars: 3, difficulty: 1, completedAt: Date.now() }
                }
            };

            // Need valid structure for Zustand persist
            localStorage.setItem(storageKey, JSON.stringify(parsed));
        });

        // 2. Reload to apply state
        await page.reload();

        // 3. Verify we are at Node 4 and it's a Camp
        const campNode = page.getByTestId('map-node-1_4');
        await expect(campNode).toBeVisible();
        // Removed emoji check because node icons were removed per user request

        // 4. Click Camp Node
        await campNode.click({ force: true });
        await expect(page).toHaveURL('/camp/1/4');

        // Assert Camp ID
        await expect(page.getByTestId('camp-title')).toBeVisible();

        // Return to Map
        await page.getByTestId('nav-map-btn').click({ force: true });
        await expect(page).toHaveURL('/map/1');
        await expect(page.getByTestId('map-title')).toBeVisible();
    });

    test('should navigate between Map and Encounter (Retreat)', async ({ page }) => {
        // Click on the current node (assuming node 1 is current/start)
        const startNode = page.getByTestId('map-node-1_1');
        await expect(startNode).toBeVisible();
        await startNode.click({ force: true });

        // Wait for the difficulty selection modal to appear
        await expect(page.getByTestId('difficulty-modal')).toBeVisible();

        // Click the start button in the modal
        await page.getByTestId('difficulty-start-btn').click({ force: true });

        // Should be in encounter with adventureId and nodeIndex
        await expect(page).toHaveURL('/encounter/1/1');

        // Check for key combat elements (unit cards instead of removed header elements)
        // Party members should be visible
        await expect(page.locator('[data-testid^="unit-card-"]').first()).toBeVisible();

        // Navigate back to map (retreat button was removed, so use browser back)
        await page.goBack();

        // Should return to Map
        await expect(page).toHaveURL('/map/1');
        await expect(page.getByTestId('map-title')).toBeVisible();
    });
});
