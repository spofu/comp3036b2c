import { test as base, expect, Page } from '@playwright/test';

// Define fixture types
type TestFixtures = {
  homePage: Page;
  authenticatedPage: Page;
};

// Extend base test with custom fixtures
export const test = base.extend<TestFixtures>({  // Home page fixture - navigates to home page before each test
  homePage: async ({ page }, use) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    // Wait for page to be ready but don't wait for title if it might not exist
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },

  // Authenticated page fixture - logs in a user before each test
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form (adjust selectors based on your app)
    await page.fill('[data-testid="email"]', 'customer@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Wait for navigation after login
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    await use(page);
  },
});

export { expect } from '@playwright/test';
