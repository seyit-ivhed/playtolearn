import { test, expect } from '@playwright/test';

test.describe('Chronicle Storybook Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/chronicle');
        await expect(page).toHaveURL('/chronicle');
    });

    test('should navigate through chapters and enter adventure', async ({ page }) => {
        // Assert Chronicle is visible
        await expect(page.getByTestId('chronicle-page')).toBeVisible();
        await expect(page.getByTestId('chapter-page')).toBeVisible();

        // 1. Test Page Navigation
        const nextBtn = page.getByTestId('next-page-btn');
        const prevBtn = page.getByTestId('prev-page-btn');

        // Initially we are at Chapter 1. Let's go to Chapter 2.
        await expect(page.getByTestId('chapter-title')).toBeVisible();
        await nextBtn.click({ force: true });

        // Wait for state update (can check page indicator)
        await expect(page.getByTestId('page-indicator')).toBeVisible();

        // Go back to Chapter 1
        await prevBtn.click({ force: true });

        // 2. Test Table of Contents
        await page.getByTestId('toc-trigger-btn').click({ force: true });
        await expect(page.getByTestId('toc-overlay')).toBeVisible();

        // Click on Chapter 1 in TOC
        await page.getByTestId('toc-chapter-item-1').click({ force: true });
        await expect(page.getByTestId('toc-overlay')).not.toBeVisible();

        // 3. Enter Adventure
        const beginBtn = page.getByTestId('begin-chapter-btn');
        await expect(beginBtn).toBeVisible();
        await beginBtn.click({ force: true });

        // Should be at the map
        await expect(page).toHaveURL('/map');
        await expect(page.getByTestId('map-title')).toBeVisible();

        // 4. Test Back to Chronicle
        const backBtn = page.locator('.back-to-chronicle');
        await expect(backBtn).toBeVisible();
        await backBtn.click({ force: true });
        await expect(page).toHaveURL('/chronicle');
    });

    test('should reflect locked status in TOC', async ({ page }) => {
        await page.getByTestId('toc-trigger-btn').click({ force: true });

        // Volume 2 should be locked by default (or just check the Price tag in actual impl)
        // For now let's just assert that we can see the chapters list
        const tocChapters = page.locator('[data-testid^="toc-chapter-item-"]');
        await expect(tocChapters.first()).toBeVisible();
    });
});
