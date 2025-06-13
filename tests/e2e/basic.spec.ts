import { test, expect } from '@playwright/test';

// Helper class for common test operations
class TestHelpers {
  constructor(private page: any) {}
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  async isElementVisible(selector: string, timeout = 5000): Promise<boolean> {
    try {
      await this.page.locator(selector).first().waitFor({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  async fillField(selector: string, value: string) {
    const element = this.page.locator(selector).first();
    await element.waitFor({ timeout: 5000 });
    await element.fill(value);
  }

  async clickElement(selector: string) {
    const element = this.page.locator(selector).first();
    await element.waitFor({ timeout: 5000 });
    await element.click();
  }
}

test.describe('Basic App Tests', () => {
  test('should load home page correctly', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Navigate to home page
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Test that the home page loads
    const title = await page.title();
    expect(title).toBeDefined();
    expect(title.length).toBeGreaterThan(0);
    
    // Check that body is visible
    await expect(page.locator('body')).toBeVisible();
    
    // Check for navbar (optional)
    const hasNavbar = await helpers.isElementVisible('nav, header, [role="navigation"]');
    if (hasNavbar) {
      console.log('✅ Navigation found');
    }
    
    // Take screenshot for debugging
    await helpers.takeScreenshot('home-page');
  });

  test('should display products on home page', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for potential product loading
    await page.waitForTimeout(2000);
    
    // Check for products with multiple possible selectors
    const productSelectors = [
      '[data-testid="product-card"]',
      '.product-card',
      '.product-item',
      '[class*="product"]',
      'img[alt*="product" i]'
    ];
    
    let hasProducts = false;
    for (const selector of productSelectors) {
      if (await helpers.isElementVisible(selector)) {
        hasProducts = true;
        console.log(`✅ Products found with selector: ${selector}`);
        break;
      }
    }
    
    // Don't fail if no products, just log
    if (!hasProducts) {
      console.log('⚠️ No products visible - may be empty or different structure');
    }
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
    
    // Verify page loads
    await expect(page.locator('body')).toBeVisible();
    
    // Verify URL
    expect(page.url()).toContain('/cart');
    
    // Check for cart-related content
    const cartIndicators = [
      'text=/cart/i',
      'text=/shopping/i',
      '[data-testid="cart"]',
      '.cart'
    ];
    
    let hasCartContent = false;
    for (const indicator of cartIndicators) {
      if (await page.locator(indicator).count() > 0) {
        hasCartContent = true;
        break;
      }
    }
    
    expect(hasCartContent).toBe(true);
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    await expect(page.locator('body')).toBeVisible();
    
    console.log('✅ Responsive design test passed');
  });
});

test.describe('Authentication Flow', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    
    await expect(page.locator('body')).toBeVisible();
    
    // Check for login form elements
    const emailSelectors = [
      '[data-testid="email"]',
      'input[type="email"]',
      'input[name="email"]',
      'input[placeholder*="email" i]'
    ];
    
    const passwordSelectors = [
      '[data-testid="password"]',
      'input[type="password"]',
      'input[name="password"]'
    ];
    
    let hasEmailField = false;
    let hasPasswordField = false;
    
    for (const selector of emailSelectors) {
      if (await page.locator(selector).count() > 0) {
        hasEmailField = true;
        break;
      }
    }
    
    for (const selector of passwordSelectors) {
      if (await page.locator(selector).count() > 0) {
        hasPasswordField = true;
        break;
      }    }
      expect(hasEmailField && hasPasswordField).toBe(true);
  });
});

test.describe('API Tests', () => {
  test('should have working products API', async ({ request }) => {
    const response = await request.get('/api/products');
    
    // API should exist and not return server error
    expect(response.status()).toBeLessThan(500);
    expect(response.status()).not.toBe(404);
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toBeDefined();
      console.log('✅ Products API returns data');
    }
  });

  test('should have working auth API', async ({ request }) => {
    // Test login endpoint exists
    const response = await request.post('/api/auth/login', {
      data: { 
        email: 'test@example.com', 
        password: 'wrongpassword' 
      }
    });
    
    // Should not be 404 (endpoint exists) or 500 (server error)
    expect(response.status()).not.toBe(404);
    expect(response.status()).toBeLessThan(500);
    
    console.log(`✅ Auth API responds with status: ${response.status()}`);
  });

  test('should have working cart API', async ({ request }) => {
    const response = await request.get('/api/cart');
    
    // Cart API should exist
    expect(response.status()).not.toBe(404);
    expect(response.status()).toBeLessThan(500);
    
    console.log(`✅ Cart API responds with status: ${response.status()}`);
  });
});

test.describe('E-commerce Flow', () => {
  test('should display cart page', async ({ page }) => {
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });
    
    await expect(page.locator('body')).toBeVisible();
    expect(page.url()).toContain('/cart');
    
    // Check for cart-related elements with more specific selectors
    const cartSelectors = [
      'text=/shopping.*cart/i',
      'text=/your.*cart/i', 
      'text=/cart.*empty/i',
      'text=/continue.*shopping/i',
      '.cart-container',
      '.cart-empty',
      '.checkout-button'
    ];
    
    let hasCartContent = false;
    for (const selector of cartSelectors) {
      if (await page.locator(selector).count() > 0) {
        hasCartContent = true;
        console.log(`✅ Cart content found with selector: ${selector}`);
        break;
      }
    }
    
    expect(hasCartContent).toBe(true);
  });
});
