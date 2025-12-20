import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/map');
        await expect(page).toHaveURL('/map');
    });

    test('should navigate between Map and Camp', async ({ page }) => {
        // Assert Map ID
        await expect(page.getByTestId('map-title')).toBeVisible();

        // 1. Hack the state to unlock Node 3 (Camp)
        await page.evaluate(() => {
            const storageKey = 'math-quest-fantasy-storage-v1';
            const currentData = localStorage.getItem(storageKey);
            const parsed = currentData ? JSON.parse(currentData) : { state: {} };

            parsed.state = {
                ...parsed.state,
                currentMapNode: 4, // Unlock up to Node 4 (Camp)
                // Ensure other required fields are present if needed, but partial update might work if hydration handles it
                // Actually, let's just update currentMapNode, assuming other state is initialized
            };

            // Need valid structure for Zustand persist
            localStorage.setItem(storageKey, JSON.stringify(parsed));
        });

        // 2. Reload to apply state
        await page.reload();

        // 3. Verify we are at Node 4 and it's a Camp
        const campNode = page.getByTestId('map-node-1_4');
        await expect(campNode).toBeVisible();
        await expect(campNode).toHaveText('⛺'); // Check for Camp Icon

        // 4. Click Camp Node
        await campNode.click({ force: true });
        await expect(page).toHaveURL(/\/camp\/1_4/);

        // Assert Camp ID
        await expect(page.getByTestId('camp-title')).toBeVisible();

        // Return to Map
        await page.getByTestId('nav-map-btn').click();
        await expect(page).toHaveURL('/map');
        await expect(page.getByTestId('map-title')).toBeVisible();
    });

    test('should navigate between Map and Encounter (Retreat)', async ({ page }) => {
        // Click on the current node (assuming node 1 is current/start)
        const startNode = page.getByTestId('map-node-1_1');
        await expect(startNode).toBeVisible();
        await startNode.click({ force: true });

        // Should be in encounter
        await expect(page).toHaveURL('/encounter');

        // Check for key combat elements (unit cards instead of removed header elements)
        // Party members should be visible
        await expect(page.locator('[data-testid^="unit-card-"]').first()).toBeVisible();

        // Navigate back to map (retreat button was removed, so use browser back)
        await page.goBack();

        // Should return to Map
        await expect(page).toHaveURL('/map');
        await expect(page.getByTestId('map-title')).toBeVisible();
    });
});
