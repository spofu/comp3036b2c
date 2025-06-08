# Test info

- Name: Protected Routes >> should maintain auth state across page navigation
- Location: C:\Users\henry\OneDrive\Documents\uni\ICT-S4\COMP3036\Major\comp3036b2c\tests\e2e\auth\protected-routes.spec.ts:89:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('text=Logout')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('text=Logout')

    at C:\Users\henry\OneDrive\Documents\uni\ICT-S4\COMP3036\Major\comp3036b2c\tests\e2e\auth\protected-routes.spec.ts:98:47
```

# Page snapshot

```yaml
- banner:
  - navigation:
    - link "CLOOOOTHES":
      - /url: /
      - paragraph: CLOOOOTHES
    - textbox "Search products..."
    - link "Shopping Cart":
      - /url: /cart
      - img "Shopping Cart"
    - link "Login":
      - /url: /login
- main:
  - heading "Our Products" [level=2]
  - text: "Category:"
  - combobox "Category:":
    - option "All Categories" [selected]
    - option "Men's T-Shirts"
    - option "Men's Jackets"
    - option "Men's Pants"
    - option "Men's Polo Shirts"
    - option "Men's Hoodies"
  - text: "Sort by:"
  - combobox "Sort by:":
    - option "Name (A-Z)" [selected]
    - option "Price (Low to High)"
    - option "Price (High to Low)"
  - paragraph: 8 products found
  - link "Business Casual Chino Pants Men's Pants Business Casual Chino Pants $59.99 Versatile cotton chino pants perfect for office or casual occasions":
    - /url: /product/768a10fb-202a-4d8c-8974-1e101f3252dc
    - img "Business Casual Chino Pants"
    - text: Men's Pants
    - heading "Business Casual Chino Pants" [level=3]
    - paragraph: $59.99
    - paragraph: Versatile cotton chino pants perfect for office or casual occasions
  - text: "Size:"
  - combobox:
    - option "30" [selected]
    - option "32"
    - option "34"
  - text: "Color:"
  - combobox:
    - option "Khaki" [selected]
    - option "Gray"
  - button "Add to Cart"
  - link "Classic Cotton Crew Neck T-Shirt Men's T-Shirts Classic Cotton Crew Neck T-Shirt $24.99 Premium 100% cotton crew neck tee with comfortable fit and durable construction":
    - /url: /product/374869b7-a5da-4c5d-aca5-63e583fce6fb
    - img "Classic Cotton Crew Neck T-Shirt"
    - text: Men's T-Shirts
    - heading "Classic Cotton Crew Neck T-Shirt" [level=3]
    - paragraph: $24.99
    - paragraph: Premium 100% cotton crew neck tee with comfortable fit and durable construction
  - text: "Size:"
  - combobox:
    - option "L" [selected]
    - option "M"
    - option "S"
    - option "XL"
  - text: "Color:"
  - combobox:
    - option "Black" [selected]
    - option "White"
  - button "Add to Cart"
  - link "Classic Pique Polo Shirt Men's Polo Shirts Classic Pique Polo Shirt $39.99 Traditional pique cotton polo with three-button placket and ribbed collar":
    - /url: /product/d32ea47b-1df3-4709-8bdd-8c8f53e1eaea
    - img "Classic Pique Polo Shirt"
    - text: Men's Polo Shirts
    - heading "Classic Pique Polo Shirt" [level=3]
    - paragraph: $39.99
    - paragraph: Traditional pique cotton polo with three-button placket and ribbed collar
  - text: "Size:"
  - combobox:
    - option "L" [selected]
    - option "M"
    - option "S"
    - option "XL"
  - text: "Color:"
  - combobox:
    - option "Navy" [selected]
    - option "White"
  - button "Add to Cart"
  - link "Genuine Leather Biker Jacket Men's Jackets Genuine Leather Biker Jacket $249.99 Premium genuine leather jacket with quilted shoulders and multiple pockets":
    - /url: /product/79460506-1f3c-43b3-952b-558762f6bab6
    - img "Genuine Leather Biker Jacket"
    - text: Men's Jackets
    - heading "Genuine Leather Biker Jacket" [level=3]
    - paragraph: $249.99
    - paragraph: Premium genuine leather jacket with quilted shoulders and multiple pockets
  - text: "Size:"
  - combobox:
    - option "L" [selected]
    - option "M"
    - option "XL"
  - text: "Color:"
  - combobox:
    - option "Black" [selected]
    - option "Brown"
  - button "Add to Cart"
  - link "Pullover Fleece Hoodie Men's Hoodies Pullover Fleece Hoodie $54.99 Cozy fleece-lined pullover hoodie with kangaroo pocket and drawstring hood":
    - /url: /product/f94066d2-a2f7-4e65-a0ab-f619b3f035ab
    - img "Pullover Fleece Hoodie"
    - text: Men's Hoodies
    - heading "Pullover Fleece Hoodie" [level=3]
    - paragraph: $54.99
    - paragraph: Cozy fleece-lined pullover hoodie with kangaroo pocket and drawstring hood
  - text: "Size:"
  - combobox:
    - option "L" [selected]
    - option "M"
    - option "S"
    - option "XL"
  - text: "Color:"
  - combobox:
    - option "Black" [selected]
    - option "Gray"
  - button "Add to Cart"
  - link "Slim Fit Dark Wash Jeans Men's Pants Slim Fit Dark Wash Jeans $79.99 Premium denim jeans with slim fit, dark wash, and comfortable stretch":
    - /url: /product/5d0b5705-7ac5-465b-bbbe-685ef36fd82d
    - img "Slim Fit Dark Wash Jeans"
    - text: Men's Pants
    - heading "Slim Fit Dark Wash Jeans" [level=3]
    - paragraph: $79.99
    - paragraph: Premium denim jeans with slim fit, dark wash, and comfortable stretch
  - text: "Size:"
  - combobox:
    - option "30" [selected]
    - option "32"
    - option "34"
    - option "36"
  - text: "Color:"
  - combobox:
    - option "Blue" [selected]
    - option "Black"
  - button "Add to Cart"
  - link "Vintage Graphic Print T-Shirt Men's T-Shirts Vintage Graphic Print T-Shirt $29.99 Retro-style graphic tee with distressed print and soft-wash finish":
    - /url: /product/12082741-8494-4708-9709-91e4d328e7ca
    - img "Vintage Graphic Print T-Shirt"
    - text: Men's T-Shirts
    - heading "Vintage Graphic Print T-Shirt" [level=3]
    - paragraph: $29.99
    - paragraph: Retro-style graphic tee with distressed print and soft-wash finish
  - text: "Size:"
  - combobox:
    - option "L" [selected]
    - option "M"
    - option "S"
    - option "XL"
  - text: "Color:"
  - combobox:
    - option "Gray" [selected]
    - option "Navy"
  - button "Add to Cart"
  - link "Waterproof Rain Jacket Men's Jackets Waterproof Rain Jacket $89.99 Lightweight waterproof jacket with breathable fabric and adjustable hood":
    - /url: /product/25737052-b5cf-4c07-a222-772099ac92b8
    - img "Waterproof Rain Jacket"
    - text: Men's Jackets
    - heading "Waterproof Rain Jacket" [level=3]
    - paragraph: $89.99
    - paragraph: Lightweight waterproof jacket with breathable fabric and adjustable hood
  - text: "Size:"
  - combobox:
    - option "L" [selected]
    - option "M"
    - option "XL"
  - text: "Color:"
  - combobox:
    - option "Black" [selected]
    - option "Navy"
  - button "Add to Cart"
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
   2 |
   3 | const TEST_USER = {
   4 |   email: 'customer@example.com',
   5 |   password: 'password123'
   6 | };
   7 |
   8 | const ADMIN_USER = {
   9 |   email: 'admin@example.com',
   10 |   password: 'admin123'
   11 | };
   12 |
   13 | test.describe('Protected Routes', () => {
   14 |   
   15 |   test('should redirect to login when accessing cart without auth', async ({ page }) => {
   16 |     await page.goto('/cart');
   17 |     
   18 |     // Should redirect to login page
   19 |     await expect(page).toHaveURL(/.*login.*/);
   20 |   });
   21 |
   22 |   test('should redirect to login when accessing checkout without auth', async ({ page }) => {
   23 |     await page.goto('/checkout');
   24 |     
   25 |     // Should redirect to login page
   26 |     await expect(page).toHaveURL(/.*login.*/);
   27 |   });
   28 |
   29 |   test('should redirect to login when accessing admin without auth', async ({ page }) => {
   30 |     await page.goto('/admin');
   31 |     
   32 |     // Should redirect to login page
   33 |     await expect(page).toHaveURL(/.*login.*/);
   34 |   });
   35 |
   36 |   test('should allow access to cart after login', async ({ page }) => {
   37 |     // Login first
   38 |     await page.goto('/login');
   39 |     await page.fill('input[type="email"]', TEST_USER.email);
   40 |     await page.fill('input[type="password"]', TEST_USER.password);
   41 |     await page.click('button[type="submit"]');
   42 |     
   43 |     // Now try to access cart
   44 |     await page.goto('/cart');
   45 |     await expect(page).toHaveURL('/cart');
   46 |     await expect(page.locator('h1')).toContainText('Cart');
   47 |   });
   48 |
   49 |   test('should allow access to checkout after login', async ({ page }) => {
   50 |     // Login first
   51 |     await page.goto('/login');
   52 |     await page.fill('input[type="email"]', TEST_USER.email);
   53 |     await page.fill('input[type="password"]', TEST_USER.password);
   54 |     await page.click('button[type="submit"]');
   55 |     
   56 |     // Now try to access checkout
   57 |     await page.goto('/checkout');
   58 |     await expect(page).toHaveURL('/checkout');
   59 |     await expect(page.locator('h1')).toContainText('Checkout');
   60 |   });
   61 |
   62 |   test('should deny admin access to regular user', async ({ page }) => {
   63 |     // Login as regular user
   64 |     await page.goto('/login');
   65 |     await page.fill('input[type="email"]', TEST_USER.email);
   66 |     await page.fill('input[type="password"]', TEST_USER.password);
   67 |     await page.click('button[type="submit"]');
   68 |     
   69 |     // Try to access admin
   70 |     await page.goto('/admin');
   71 |     
   72 |     // Should be redirected or show access denied
   73 |     await expect(page).not.toHaveURL('/admin');
   74 |   });
   75 |
   76 |   test('should allow admin access to admin user', async ({ page }) => {
   77 |     // Login as admin
   78 |     await page.goto('/login');
   79 |     await page.fill('input[type="email"]', ADMIN_USER.email);
   80 |     await page.fill('input[type="password"]', ADMIN_USER.password);
   81 |     await page.click('button[type="submit"]');
   82 |     
   83 |     // Try to access admin
   84 |     await page.goto('/admin');
   85 |     await expect(page).toHaveURL('/admin');
   86 |     await expect(page.locator('h1')).toContainText('Admin');
   87 |   });
   88 |
   89 |   test('should maintain auth state across page navigation', async ({ page }) => {
   90 |     // Login
   91 |     await page.goto('/login');
   92 |     await page.fill('input[type="email"]', TEST_USER.email);
   93 |     await page.fill('input[type="password"]', TEST_USER.password);
   94 |     await page.click('button[type="submit"]');
   95 |     
   96 |     // Navigate to different pages
   97 |     await page.goto('/');
>  98 |     await expect(page.locator('text=Logout')).toBeVisible();
      |                                               ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   99 |     
  100 |     await page.goto('/cart');
  101 |     await expect(page.locator('text=Logout')).toBeVisible();
  102 |     
  103 |     await page.goto('/search');
  104 |     await expect(page.locator('text=Logout')).toBeVisible();
  105 |   });
  106 |
  107 |   test('should clear auth state after logout', async ({ page }) => {
  108 |     // Login
  109 |     await page.goto('/login');
  110 |     await page.fill('input[type="email"]', TEST_USER.email);
  111 |     await page.fill('input[type="password"]', TEST_USER.password);
  112 |     await page.click('button[type="submit"]');
  113 |     
  114 |     // Logout
  115 |     await page.click('text=Logout');
  116 |     
  117 |     // Try to access protected route
  118 |     await page.goto('/cart');
  119 |     await expect(page).toHaveURL(/.*login.*/);
  120 |   });
  121 | });
  122 |
```