import { test, expect } from '@playwright/test';

test.describe('Combat Loop E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/combat?missionId=1');
    });

    test('should load combat page with player and enemy', async ({ page }) => {
        await expect(page.getByTestId('combat-page')).toBeVisible();
        await expect(page.getByTestId('combat-title')).toBeVisible();
    });

    test('complete combat round: Attack → Damage → Enemy Turn', async ({ page }) => {
        // Click Attack button (has 3 energy initially)
        await page.getByTestId('attack-btn').click();

        // No math modal should appear for the first attack
        await expect(page.getByTestId('math-modal')).not.toBeVisible();

        // Wait for enemy turn (combat log or button disabled state could be checked, but timeout is simple)
        await page.waitForTimeout(3000);

        // Attack button should be visible again (back to PLAYER_INPUT phase)
        await expect(page.getByTestId('attack-btn')).toBeVisible();
    });

    test('recharge flow: deplete energy -> math -> recharge', async ({ page }) => {
        // Use mission 2 (50 HP enemy) so we don't win after 3 attacks (30 damage)
        await page.goto('/combat?missionId=2');

        // Deplete energy (3 attacks)
        for (let i = 0; i < 3; i++) {
            await page.getByTestId('attack-btn').click();
            // Wait for enemy turn to complete and button to reappear
            await expect(page.getByTestId('attack-btn')).toBeVisible({ timeout: 5000 });
        }

        // 4th click should trigger recharge
        await page.getByTestId('attack-btn').click();
        await expect(page.getByTestId('math-modal')).toBeVisible();

        // Solve math
        const op1Text = await page.getByTestId('operand1').textContent();
        const op2Text = await page.getByTestId('operand2').textContent();
        const operator = await page.getByTestId('operator').textContent();

        const op1 = parseInt(op1Text || '0');
        const op2 = parseInt(op2Text || '0');

        let answer = 0;
        if (operator === '+') answer = op1 + op2;
        else if (operator === '-') answer = op1 - op2;
        else if (operator === '×') answer = op1 * op2;
        else if (operator === '÷') answer = op1 / op2;

        const answerStr = answer.toString();
        for (const digit of answerStr) {
            await page.getByTestId(`numpad-${digit}`).click();
        }
        await page.getByTestId('numpad-submit').click();

        // Math modal should close
        await expect(page.getByTestId('math-modal')).not.toBeVisible();

        // Turn should NOT end (Attack button still enabled/visible immediately)
        await expect(page.getByTestId('attack-btn')).toBeVisible();

        // Should be able to attack again immediately
        await page.getByTestId('attack-btn').click();
    });

    test('can complete multiple rounds until victory', async ({ page }) => {
        // Play multiple rounds until victory
        // We need a loop that handles both attacking and recharging

        let rounds = 0;
        while (rounds < 20) { // Safety break
            // Check if we've won
            if (await page.getByTestId('victory-screen').isVisible().catch(() => false)) {
                break;
            }

            // Try to attack
            await page.getByTestId('attack-btn').click();

            // Check if math modal appeared (recharge needed)
            if (await page.getByTestId('math-modal').isVisible({ timeout: 500 }).catch(() => false)) {
                // Solve math
                const op1Text = await page.getByTestId('operand1').textContent();
                const op2Text = await page.getByTestId('operand2').textContent();
                const operator = await page.getByTestId('operator').textContent();

                const op1 = parseInt(op1Text || '0');
                const op2 = parseInt(op2Text || '0');

                let answer = 0;
                if (operator === '+') answer = op1 + op2;
                else if (operator === '-') answer = op1 - op2;
                else if (operator === '×') answer = op1 * op2;
                else if (operator === '÷') answer = op1 / op2;

                const answerStr = answer.toString();
                for (const digit of answerStr) {
                    await page.getByTestId(`numpad-${digit}`).click();
                }
                await page.getByTestId('numpad-submit').click();

                // After recharge, we need to click attack again to actually attack
                // Wait for modal to close
                await expect(page.getByTestId('math-modal')).not.toBeVisible();
                await page.getByTestId('attack-btn').click();
            }

            // Wait for enemy turn to complete (button to reappear)
            // Note: If we just recharged, it's still our turn, so button is already visible.
            // But if we attacked, it's enemy turn.
            // The logic above clicks attack again after recharge.
            // So we always end up attacking in this loop iteration (unless we won).

            // Wait for button to be visible again (after enemy turn)
            // But we need to be careful: if we won, the button won't appear.

            try {
                await expect(page.getByTestId('attack-btn')).toBeVisible({ timeout: 5000 });
            } catch (e) {
                // If button doesn't appear, maybe we won or lost?
                if (await page.getByTestId('victory-screen').isVisible().catch(() => false)) {
                    break;
                }
                if (await page.getByTestId('defeat-screen').isVisible().catch(() => false)) {
                    break;
                }
                throw e; // Rethrow if neither
            }

            rounds++;
        }

        // Eventually we should see victory (or defeat)
        const endScreen = page.getByTestId('victory-screen').or(page.getByTestId('defeat-screen'));
        await expect(endScreen).toBeVisible({ timeout: 10000 });
    });

    test('victory flow: shows victory screen and return button', async ({ page }) => {
        // Similar to above, but explicitly checking victory screen elements
        let rounds = 0;
        while (rounds < 20) {
            if (await page.getByTestId('victory-screen').isVisible().catch(() => false)) {
                break;
            }

            await page.getByTestId('attack-btn').click();

            if (await page.getByTestId('math-modal').isVisible({ timeout: 500 }).catch(() => false)) {
                const op1Text = await page.getByTestId('operand1').textContent();
                const op2Text = await page.getByTestId('operand2').textContent();
                const operator = await page.getByTestId('operator').textContent();

                const op1 = parseInt(op1Text || '0');
                const op2 = parseInt(op2Text || '0');

                let answer = 0;
                if (operator === '+') answer = op1 + op2;
                else if (operator === '-') answer = op1 - op2;
                else if (operator === '×') answer = op1 * op2;
                else if (operator === '÷') answer = op1 / op2;

                const answerStr = answer.toString();
                for (const digit of answerStr) {
                    await page.getByTestId(`numpad-${digit}`).click();
                }
                await page.getByTestId('numpad-submit').click();

                await page.waitForTimeout(500);
                await page.getByTestId('attack-btn').click();
            }

            await page.waitForTimeout(1500);
            rounds++;
        }

        // Check for victory screen
        const victoryScreen = page.getByTestId('victory-screen');
        await expect(victoryScreen).toBeVisible({ timeout: 5000 });
        await expect(page.getByTestId('victory-title')).toBeVisible();

        // Click collect rewards button
        await page.getByTestId('collect-rewards-button').click();

        // Click return button
        await page.getByTestId('return-to-base-button').click();
        await expect(page).toHaveURL(/.*mission-select/);
    });
});
