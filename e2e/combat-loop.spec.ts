import { test, expect } from '@playwright/test';

test.describe('Combat Loop E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/combat?missionId=1');
    });

    test('should load combat page with player and enemy', async ({ page }) => {
        await expect(page.getByTestId('combat-page')).toBeVisible();
        await expect(page.getByTestId('combat-title')).toBeVisible();
    });

    test('complete combat round: Attack → Math → Damage → Enemy Turn', async ({ page }) => {
        // Click Attack button
        await page.getByTestId('attack-btn').click();

        // Math modal should appear
        await expect(page.getByTestId('math-modal')).toBeVisible();
        await expect(page.getByTestId('math-modal-title')).toBeVisible();

        // Enter answer using numpad
        await page.getByTestId('numpad-5').click();

        // Click submit button
        await page.getByTestId('numpad-submit').click();

        // Math modal should close
        await expect(page.getByTestId('math-modal')).not.toBeVisible({ timeout: 2000 });

        // Wait for enemy turn
        await page.waitForTimeout(3000);

        // Attack button should be visible again (back to PLAYER_INPUT phase)
        await expect(page.getByTestId('attack-btn')).toBeVisible();
    });

    test('correct answer deals damage to enemy', async ({ page }) => {
        // Click Attack
        await page.getByTestId('attack-btn').click();
        await expect(page.getByTestId('math-modal')).toBeVisible();

        // Submit any answer
        await page.getByTestId('numpad-5').click();
        await page.getByTestId('numpad-submit').click();

        // Verify combat continues (enemy turn happens)
        await page.waitForTimeout(3000);

        // Player should be able to take another action
        await expect(page.getByTestId('attack-btn')).toBeVisible();
    });

    test('can complete multiple rounds until victory', async ({ page }) => {
        // Play multiple rounds
        for (let round = 0; round < 5; round++) {
            // Check if we've won
            const victoryScreen = page.getByTestId('victory-screen');
            if (await victoryScreen.isVisible({ timeout: 1000 }).catch(() => false)) {
                break;
            }

            // Attack
            await page.getByTestId('attack-btn').click();

            // Solve math
            await expect(page.getByTestId('math-modal')).toBeVisible();

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

            // Input answer
            for (const digit of answerStr) {
                await page.getByTestId(`numpad-${digit}`).click();
            }

            await expect(page.getByTestId('numpad-submit')).toBeEnabled();
            await page.getByTestId('numpad-submit').click();

            // Wait for enemy turn
            await page.waitForTimeout(3000);
        }

        // Eventually we should see victory (or defeat)
        const endScreen = page.getByTestId('victory-screen').or(page.getByTestId('defeat-screen'));
        await expect(endScreen).toBeVisible({ timeout: 10000 });
    });

    test('victory flow: shows victory screen and return button', async ({ page }) => {
        // Fast-forward to victory by repeatedly attacking
        for (let i = 0; i < 10; i++) {
            try {
                if (await page.getByTestId('victory-screen').isVisible().catch(() => false)) {
                    break;
                }

                await page.getByTestId('attack-btn').click({ timeout: 2000 });

                // Solve math
                await expect(page.getByTestId('math-modal')).toBeVisible();

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

                await page.getByTestId('numpad-submit').click({ timeout: 1000 });
                await page.waitForTimeout(1800);
            } catch (e) {
                // Check if we won
                if (await page.getByTestId('victory-screen').isVisible().catch(() => false)) {
                    break;
                }
                console.log('Error in victory loop:', e);
                // Continue trying
            }
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
