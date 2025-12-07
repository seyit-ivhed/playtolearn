import { test, expect } from '@playwright/test';

test.describe('Redesign Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Go to map directly to bypass redirect issues in test env
        await page.goto('/map');
    });

    test('should load map', async ({ page }) => {
        await expect(page).toHaveURL('/map');
        await expect(page.getByTestId('map-title')).toBeVisible();
        await expect(page.getByTestId('map-node-1')).toBeVisible();
    });

    test('should navigate to camp and manage party', async ({ page }) => {
        // Click Camp Button
        await page.getByTestId('nav-camp-btn').click();
        await expect(page).toHaveURL('/camp');
        await expect(page.getByTestId('camp-title')).toBeVisible();

        // Remove a member (Fire Knight)
        // Note: The card ID is based on companion ID 'fire_knight'
        const fireKnightCard = page.getByTestId('party-card-fire_knight');
        await fireKnightCard.click(); // Should remove

        // Check if slot is empty
        // We use .first() because removing one knight creates one empty slot, but there might be others initially if we didn't start full
        // Based on our store, we start full. So removing one creates one.
        await expect(page.getByTestId('empty-slot').first()).toBeVisible();

        // Return to Map
        await page.getByTestId('nav-map-btn').click();
        await expect(page).toHaveURL('/map');
    });

    test('should start encounter and retreat', async ({ page }) => {
        // Click Node 1 (Start)
        await page.getByTestId('map-node-1').click();

        await expect(page).toHaveURL('/encounter');

        // Check for turn indicator
        await expect(page.getByTestId('combat-turn-indicator')).toHaveText('YOUR TURN');

        // Check for Party Member (Fire Knight should be there unless we removed him in previous test - tests are isolated usually)
        await expect(page.getByTestId('unit-card-fire_knight')).toBeVisible();

        // Retreat
        await page.on('dialog', dialog => dialog.accept());
        await page.getByTestId('combat-retreat-btn').click();

        await expect(page).toHaveURL('/map');
    });

    test('should perform combat action', async ({ page }) => {
        // Go to combat
        await page.getByTestId('map-node-1').click();

        // Select Fire Knight
        await page.getByTestId('unit-card-fire_knight').click();

        // Click ACT
        await page.getByTestId('combat-act-btn').click();

        // Check log for attack
        await expect(page.getByTestId('combat-log')).toContainText('Fire Knight used Flame Strike');
    });
});
