import { test, expect } from '@playwright/test';
import { interceptSupabaseAuth } from './helpers';

test.describe('Adventure Map', () => {
    test.beforeEach(async ({ page }) => {
        await interceptSupabaseAuth(page);
    });

    test('adventure map loads with encounter nodes for adventure 1', async ({ page }) => {
        await page.goto('/map/1');
        await expect(page.locator('[data-testid="map-node-1_1"]')).toBeVisible();
    });

    test('clicking an encounter node opens the difficulty selection modal', async ({ page }) => {
        await page.goto('/map/1');
        await expect(page.locator('[data-testid="map-node-1_1"]')).toBeVisible();
        await page.click('[data-testid="map-node-1_1"]', { force: true });
        await expect(page.locator('[data-testid="difficulty-modal"]')).toBeVisible();
    });

    test('difficulty modal contains a start button and dropdown', async ({ page }) => {
        await page.goto('/map/1');
        await expect(page.locator('[data-testid="map-node-1_1"]')).toBeVisible();
        await page.click('[data-testid="map-node-1_1"]', { force: true });
        await expect(page.locator('[data-testid="difficulty-modal"]')).toBeVisible();
        await expect(page.locator('[data-testid="difficulty-dropdown"]')).toBeVisible();
        await expect(page.locator('[data-testid="difficulty-start-btn"]')).toBeVisible();
    });

    test('starting an encounter from the modal navigates to the encounter page', async ({ page }) => {
        await page.goto('/map/1');
        await expect(page.locator('[data-testid="map-node-1_1"]')).toBeVisible();
        await page.click('[data-testid="map-node-1_1"]', { force: true });
        await expect(page.locator('[data-testid="difficulty-modal"]')).toBeVisible();
        await page.click('[data-testid="difficulty-start-btn"]', { force: true });
        await expect(page).toHaveURL(/\/encounter\/1\/1/);
    });

    test('back button on the map navigates to the chronicle', async ({ page }) => {
        await page.goto('/map/1');
        await page.click('[data-testid="back-to-chronicle-btn"]', { force: true });
        await expect(page).toHaveURL(/\/chronicle/);
    });
});
