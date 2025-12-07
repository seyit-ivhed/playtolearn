import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/map');
        await expect(page).toHaveURL('/map');
    });

    test('should navigate between Map and Camp', async ({ page }) => {
        // Assert Map ID
        await expect(page.getByTestId('map-title')).toBeVisible();

        // Go to Camp
        await page.getByTestId('nav-camp-btn').click();
        await expect(page).toHaveURL('/camp');

        // Assert Camp ID
        await expect(page.getByTestId('camp-title')).toBeVisible();

        // Return to Map
        await page.getByTestId('nav-map-btn').click();
        await expect(page).toHaveURL('/map');
        await expect(page.getByTestId('map-title')).toBeVisible();
    });

    test('should navigate between Map and Encounter (Retreat)', async ({ page }) => {
        // Setup dialog handler for retreat confirmation
        page.on('dialog', dialog => dialog.accept());

        // Click on the current node (assuming node 1 is current/start)
        const startNode = page.getByTestId('map-node-1');
        await expect(startNode).toBeVisible();
        await startNode.click({ force: true });

        // Should be in encounter
        await expect(page).toHaveURL('/encounter');

        // Check for key combat elements
        await expect(page.getByTestId('combat-retreat-btn')).toBeVisible();
        await expect(page.getByTestId('combat-turn-indicator')).toBeVisible();

        // Click Retreat
        await page.getByTestId('combat-retreat-btn').click();

        // Dialog handling triggers automatically via the listener above

        // Should return to Map
        await expect(page).toHaveURL('/map');
        await expect(page.getByTestId('map-title')).toBeVisible();
    });
});
