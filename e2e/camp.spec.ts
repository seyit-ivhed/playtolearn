
import { test, expect } from '@playwright/test';

test.describe('Camp Page', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to camp page with adventureId parameter
        // Using adventure 1 as the default test adventure
        await page.goto('http://localhost:5173/camp/1');
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
