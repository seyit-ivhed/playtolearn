
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
    });

    test('should display return to map button', async ({ page }) => {
        await expect(page.getByTestId('nav-map-btn')).toBeVisible();
    });

    test('should display party slots', async ({ page }) => {
        await expect(page.getByTestId('party-card-amara')).toBeVisible();
    });

    test('should distribute XP to companion', async ({ page }) => {
        const xpValue = page.getByTestId('xp-value');
        await expect(xpValue).toBeVisible();

        const initialXpText = await xpValue.innerText();
        const initialXp = parseInt(initialXpText);

        if (initialXp >= 10) {
            // Find level up button for Amara
            const levelUpBtn = page.getByTestId('level-up-btn-amara');
            await levelUpBtn.click({ force: true });

            // Verify shared XP changed (by checking it's not the initial value anymore)
            await expect(xpValue).not.toHaveText(initialXpText);
        }
    });
});
