import { test, expect } from '@playwright/test';

test.describe('NewsPage - Fetch and Display News', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the NewsPage
        await page.goto('http://localhost:3000'); 
    });

    test('should fetch and display news articles', async ({ page }) => {
        // Wait for news items to load (Assume each news card has a class "news-card")
        await page.waitForSelector('.news-card', { timeout: 5000 });

        // Check if at least one news card is displayed
        const newsItems = await page.locator('.news-card');
        await expect(newsItems).toHaveCountGreaterThan(0);
    });

    test('should load more news on scroll', async ({ page }) => {
        // Wait for initial load
        await page.waitForSelector('.news-card', { timeout: 5000 });

        // Get initial news count
        const initialCount = await page.locator('.news-card').count();

        // Scroll to the bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Wait for additional news to load
        await page.waitForTimeout(2000); // Adjust based on API response time

        // Get new news count
        const updatedCount = await page.locator('.news-card').count();

        // Check if new articles are added
        await expect(updatedCount).toBeGreaterThan(initialCount);
    });

    test('should show loading skeleton before news loads', async ({ page }) => {
        // Check if skeleton loader is visible initially
        await expect(page.locator('.news-card-skeleton')).toBeVisible();

        // Wait for news to load and check if skeleton disappears
        await page.waitForSelector('.news-card', { timeout: 5000 });
        await expect(page.locator('.news-card-skeleton')).not.toBeVisible();
    });
});
