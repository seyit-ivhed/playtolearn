import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Space Math Academy/);
});

test('mission select is the landing page', async ({ page }) => {
    await page.goto('/');
    // Should see mission select content immediately
    await expect(page.getByTestId('mission-node-1')).toBeVisible();
});

test('can navigate to ship bay', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('ship-bay-btn').click();
    await expect(page).toHaveURL(/.*ship-bay/);
});

test('can navigate to combat from mission select', async ({ page }) => {
    await page.goto('/');
    // Click the first mission node
    await page.getByTestId('mission-node-1').click();
    // Click the "Start Mission" button in the modal
    await page.getByTestId('start-mission-btn').click();
    await expect(page).toHaveURL(/.*combat/);
    await expect(page.getByTestId('combat-page')).toBeVisible();
});
