import { test, expect } from '@playwright/test';

test.describe('News Fetching Functionality', () => {
  test('should login and fetch news articles', async ({ page }) => {
    // Enable detailed network logging
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log(`Request: ${request.method()} ${request.url()}`);
      }
    });
    
    page.on('response', async response => {
      if (response.url().includes('/api/')) {
        console.log(`Response: ${response.status()} ${response.url()}`);
        try {
          if (response.headers()['content-type']?.includes('application/json')) {
            const text = await response.text();
            console.log(`Response Body (first 200 chars): ${text.substring(0, 200)}...`);
          }
        } catch (e) {}
      }
    });

    // 1. Navigate to the login page
    await page.goto('http://localhost:3000/login');
    await page.screenshot({ path: 'test-results/images/login-page.png' });
    
    // 2. Fill in login credentials
    await page.fill('input[type="email"]', 'testuser@example.com');
    await page.fill('input[type="password"]', '*securePassword123'); 
    
    // 3. Submit the login form
    await page.click('button[type="submit"]');
    
    // 4. Wait for login to complete (redirect or dashboard to load)
    await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {
      console.log('No navigation occurred after login, continuing...');
    });
    
    await page.screenshot({ path: 'test-results/images/after-login.png' });
    
    // 5. Navigate to the news page
    await page.goto('http://localhost:3000');
    
    // 6. Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot at this point
    await page.screenshot({ path: 'test-results/images/news-page.png' });
    
    // 7. Check for news content
    const newsElements = await page.locator('.news-card, article, .cursor-pointer:has(img)').count();
    console.log(`Found ${newsElements} news elements on page`);
      
    expect(newsElements).toBeGreaterThan(0);
    
    // 8. Verify at least one news item is visible
    const possibleSelectors = [
      '.news-card', 
      'article', 
      '.cursor-pointer:has(img)',
      'div:has(> img + h5)',
      '.container div[class*="grid"] > div'
    ];
    
    let foundNewsItems = false;
    
    for (const selector of possibleSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`Found ${count} news items with selector: ${selector}`);
        
        // Verify first item is visible
        await expect(page.locator(selector).first()).toBeVisible();
        
        // Check for expected content in first item
        const firstItem = page.locator(selector).first();
        const hasImage = await firstItem.locator('img').count() > 0;
        const hasTitle = await firstItem.locator('h5, h3, h4, .title').count() > 0;
        
        console.log(`First news item has image: ${hasImage}, title: ${hasTitle}`);
        foundNewsItems = true;
        break;
      }
    }
    
    expect(foundNewsItems).toBeTruthy();
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/images/final-state.png' });
  });
});