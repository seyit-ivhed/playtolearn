import { test, expect } from '@playwright/test';

test.describe('Math Mechanics Flow', () => {

    test('should trigger math modal on special attack', async ({ page }) => {
        await page.goto('/encounter');

        await page.evaluate(() => {
            const store = (window as any).useCombatStore;
            if (store) {
                store.setState({
                    phase: 'PLAYER_TURN',
                    party: [{
                        id: 'hero-1', templateId: 'fire-knight', name: 'Hero', isPlayer: true,
                        maxHealth: 100, currentHealth: 100, currentShield: 0,
                        hasActed: false, icon: 'H', color: 'blue'
                    }],
                    monsters: [],
                    specialMeter: 100 // FULL
                });
            }
        });

        // Verify Special Trigger
        const specialTrigger = page.getByText(/UNLEASH ULTIMATE/i);
        await expect(specialTrigger).toBeVisible();

        // Click to Open Modal
        await specialTrigger.click({ force: true });

        // Verify Modal Opens
        await expect(page.getByText(/ULTIMATE CASTING!/i)).toBeVisible();

        // Verify Closing
        const cancelBtn = page.getByTestId('modal-cancel-btn');
        await expect(cancelBtn).toBeVisible();
        await cancelBtn.evaluate((node) => (node as HTMLElement).click());
    });
});
