
import { test, expect } from '@playwright/test';

test.describe('Camp Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to camp page. Assuming we can go there directly or via map.
        // For stability, we might want to inject state or navigate from map?
        // Let's try direct navigation first if the app supports it, 
        // but the app might need initialization.
        // A safer bet is to go to map then camp if buttons exist.
        // But for now let's try direct URL and wait for title.
        await page.goto('http://localhost:5173/camp');
    });

    test('should display camp page title', async ({ page }) => {
        await expect(page.getByTestId('camp-title')).toBeVisible();
        await expect(page.getByTestId('camp-title')).toHaveText('Fellowship Camp');
    });

    test('should display return to map button', async ({ page }) => {
        await expect(page.getByTestId('nav-map-btn')).toBeVisible();
    });

    test('should display party slots', async ({ page }) => {
        // There should be 4 slots total (empty or occupied)
        // We can count them via logic, or just check at least one empty slot exists if we start fresh
        // or checks for specific known IDs if we pre-seeded data.
        // Let's check for presence of empty slots or party cards.

        // Just checking we have the container or some slots.
        // Since default state might have 1 hero?

        // We can just check that we don't crash and see some slots.
        // Check for specific known party member from initial state
        await expect(page.getByTestId('party-card-amara')).toBeVisible();
    });
});
