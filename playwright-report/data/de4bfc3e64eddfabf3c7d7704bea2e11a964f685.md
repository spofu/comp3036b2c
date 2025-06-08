# Test info

- Name: Products E2E >> should filter products by category
- Location: C:\Users\henry\OneDrive\Documents\uni\ICT-S4\COMP3036\Major\comp3036b2c\tests\e2e\products\products.spec.ts:35:7

# Error details

```
TimeoutError: page.goto: Timeout 10000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at C:\Users\henry\OneDrive\Documents\uni\ICT-S4\COMP3036\Major\comp3036b2c\tests\e2e\products\products.spec.ts:36:16
```

# Page snapshot

```yaml
- banner:
  - navigation:
    - link "CLOOOOTHES":
      - /url: /
      - paragraph: CLOOOOTHES
    - list
    - textbox "Search products..."
    - link "Shopping Cart":
      - /url: /cart
      - img "Shopping Cart"
    - link "Login":
      - /url: /login
- main:
  - paragraph: Loading products...
- contentinfo:
  - contentinfo:
    - heading "CLOOOOTHES" [level=3]
    - paragraph: Discover the latest trends in fashion with our curated collections for men, women, and kids.
    - link "Facebook":
      - /url: "#"
    - link "Instagram":
      - /url: "#"
    - link "Twitter":
      - /url: "#"
    - heading "Shop" [level=3]
    - list:
      - listitem:
        - link "Shop our collection.":
          - /url: /
    - heading "Support" [level=3]
    - list:
      - listitem:
        - link "Contact Us":
          - /url: /contact
      - listitem:
        - link "FAQ":
          - /url: /faq
      - listitem:
        - link "Shipping & Returns":
          - /url: /shipping
      - listitem:
        - link "Size Guide":
          - /url: /size-guide
      - listitem:
        - link "Track Order":
          - /url: /track-order
    - heading "Contact" [level=3]
    - paragraph:
      - img
      - text: 123 Fashion Street, London, UK
    - paragraph:
      - img
      - text: +44 1234 567890
    - paragraph:
      - img
      - text: support@ecommercetype.com
    - text: VISA MC AMEX PayPal Apple
    - paragraph: © 2025 E-Commerce Type Shii. All rights reserved.
    - link "Privacy Policy":
      - /url: /privacy
    - link "Terms of Service":
      - /url: /terms
    - link "Returns Policy":
      - /url: /returns
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { testUsers } from '../fixtures/testData';
   3 |
   4 | test.describe('Products E2E', () => {
   5 |   test('should display products on homepage', async ({ page }) => {
   6 |     await page.goto('/');
   7 |     
   8 |     // Check if products are displayed
   9 |     await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  10 |     await expect(page.locator('text=Premium')).toBeVisible();
  11 |   });
  12 |
  13 |   test('should navigate to product detail page', async ({ page }) => {
  14 |     await page.goto('/');
  15 |     
  16 |     // Click on first product
  17 |     await page.locator('[data-testid="product-card"]').first().click();
  18 |     
  19 |     // Verify we're on product detail page
  20 |     await expect(page.locator('[data-testid="product-detail"]')).toBeVisible();
  21 |     await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
  22 |   });
  23 |
  24 |   test('should search for products', async ({ page }) => {
  25 |     await page.goto('/');
  26 |     
  27 |     // Search for a product
  28 |     await page.fill('[data-testid="search-input"]', 'shirt');
  29 |     await page.press('[data-testid="search-input"]', 'Enter');
  30 |       // Verify search results
  31 |     await expect(page.locator('text=Search Results')).toBeVisible();
  32 |     await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  33 |   });
  34 |
  35 |   test('should filter products by category', async ({ page }) => {
> 36 |     await page.goto('/');
     |                ^ TimeoutError: page.goto: Timeout 10000ms exceeded.
  37 |       // Click on category filter if available
  38 |     const categoryFilter = page.locator('text=Clothing').first();
  39 |     if (await categoryFilter.isVisible()) {
  40 |       await categoryFilter.click();
  41 |       await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  42 |     }
  43 |   });
  44 |
  45 |   test('should handle product not found', async ({ page }) => {
  46 |     await page.goto('/product/nonexistent-id');
  47 |     
  48 |     // Should show error or redirect
  49 |     await expect(page.locator('text=Not Found').or(page.locator('text=Error'))).toBeVisible();
  50 |   });
  51 | });
  52 |
```