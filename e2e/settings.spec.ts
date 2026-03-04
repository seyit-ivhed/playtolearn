import { test, expect } from '@playwright/test';
import { interceptSupabaseAuth } from './helpers';

test.describe('Settings', () => {
    test.beforeEach(async ({ page }) => {
        await interceptSupabaseAuth(page);
    });

    test('settings button is visible on the chronicle page', async ({ page }) => {
        await page.goto('/chronicle/cover');
        await expect(page.locator('[data-testid="settings-button"]')).toBeVisible();
    });

    test('clicking the settings button opens the settings modal', async ({ page }) => {
        await page.goto('/chronicle/cover');
        await expect(page.locator('[data-testid="settings-button"]')).toBeVisible();
        await page.click('[data-testid="settings-button"]', { force: true });
        await expect(page.locator('[data-testid="settings-menu"]')).toBeVisible();
    });

    test('settings button is accessible from the adventure map', async ({ page }) => {
        await page.goto('/map/1');
        await expect(page.locator('[data-testid="map-node-1_1"]')).toBeVisible();
        await expect(page.locator('[data-testid="settings-button"]')).toBeVisible();
        await page.click('[data-testid="settings-button"]', { force: true });
        await expect(page.locator('[data-testid="settings-menu"]')).toBeVisible();
    });

    test('settings button is accessible from the encounter page', async ({ page }) => {
        await page.goto('/encounter/1/1');
        await expect(page.locator('[data-testid^="unit-card-"]').first()).toBeVisible();
        await expect(page.locator('[data-testid="settings-button"]')).toBeVisible();
        await page.click('[data-testid="settings-button"]', { force: true });
        await expect(page.locator('[data-testid="settings-menu"]')).toBeVisible();
    });
});
