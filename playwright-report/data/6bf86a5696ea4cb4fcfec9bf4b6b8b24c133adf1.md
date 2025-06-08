# Test info

- Name: Authentication >> should not register user with existing email
- Location: C:\Users\henry\OneDrive\Documents\uni\ICT-S4\COMP3036\Major\comp3036b2c\tests\e2e\auth\auth.spec.ts:114:7

# Error details

```
TimeoutError: page.fill: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="Name"]')

    at C:\Users\henry\OneDrive\Documents\uni\ICT-S4\COMP3036\Major\comp3036b2c\tests\e2e\auth\auth.spec.ts:118:16
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
  - heading "Create Account" [level=1]
  - paragraph: Sign up to start shopping with us
  - text: Full Name
  - textbox "Full Name"
  - text: Email Address
  - textbox "Email Address"
  - text: Password
  - textbox "Password"
  - button:
    - img
  - button "Create Account"
  - paragraph:
    - text: Already have an account?
    - button "Sign In"
    - text: "|"
    - link "Return to Shop":
      - /url: /
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
   18 |     name: 'Test User'
   19 |   }
   20 | };
   21 |
   22 | test.describe('Authentication', () => {
   23 |   test.beforeEach(async ({ page }) => {
   24 |     await page.goto('/');
   25 |   });
   26 |
   27 |   test('should display login form', async ({ page }) => {
   28 |     await page.click('text=Login');
   29 |     
   30 |     await expect(page.locator('input[type="email"]')).toBeVisible();
   31 |     await expect(page.locator('input[type="password"]')).toBeVisible();
   32 |     await expect(page.locator('button[type="submit"]')).toBeVisible();
   33 |   });
   34 |
   35 |   test('should login with valid customer credentials', async ({ page }) => {
   36 |     await page.click('text=Login');
   37 |     
   38 |     await page.fill('input[type="email"]', TEST_USERS.customer.email);
   39 |     await page.fill('input[type="password"]', TEST_USERS.customer.password);
   40 |     await page.click('button[type="submit"]');
   41 |     
   42 |     // Should redirect to home page and show user is logged in
   43 |     await expect(page).toHaveURL('/');
   44 |     await expect(page.locator('text=Logout')).toBeVisible();
   45 |   });
   46 |
   47 |   test('should login with valid admin credentials', async ({ page }) => {
   48 |     await page.click('text=Login');
   49 |     
   50 |     await page.fill('input[type="email"]', TEST_USERS.admin.email);
   51 |     await page.fill('input[type="password"]', TEST_USERS.admin.password);
   52 |     await page.click('button[type="submit"]');
   53 |     
   54 |     // Should redirect and show admin is logged in
   55 |     await expect(page).toHaveURL('/');
   56 |     await expect(page.locator('text=Logout')).toBeVisible();
   57 |     // Admin should see admin link
   58 |     await expect(page.locator('text=Admin')).toBeVisible();
   59 |   });
   60 |
   61 |   test('should show error for invalid credentials', async ({ page }) => {
   62 |     await page.click('text=Login');
   63 |     
   64 |     await page.fill('input[type="email"]', 'invalid@email.com');
   65 |     await page.fill('input[type="password"]', 'wrongpassword');
   66 |     await page.click('button[type="submit"]');
   67 |     
   68 |     // Should show error message
   69 |     await expect(page.locator('text=Invalid')).toBeVisible();
   70 |   });
   71 |
   72 |   test('should validate required fields', async ({ page }) => {
   73 |     await page.click('text=Login');
   74 |     await page.click('button[type="submit"]');
   75 |     
   76 |     // Should show validation errors
   77 |     await expect(page.locator('input[type="email"]:invalid')).toBeVisible();
   78 |   });
   79 |
   80 |   test('should logout successfully', async ({ page }) => {
   81 |     // Login first
   82 |     await page.click('text=Login');
   83 |     await page.fill('input[type="email"]', TEST_USERS.customer.email);
   84 |     await page.fill('input[type="password"]', TEST_USERS.customer.password);
   85 |     await page.click('button[type="submit"]');
   86 |     
   87 |     // Wait for login to complete
   88 |     await expect(page.locator('text=Logout')).toBeVisible();
   89 |     
   90 |     // Logout
   91 |     await page.click('text=Logout');
   92 |     
   93 |     // Should show login option again
   94 |     await expect(page.locator('text=Login')).toBeVisible();
   95 |     await expect(page.locator('text=Logout')).not.toBeVisible();
   96 |   });
   97 |
   98 |   test('should register new user', async ({ page }) => {
   99 |     await page.click('text=Login');
  100 |     
  101 |     // Switch to sign up
  102 |     await page.click('text=Sign up');
  103 |     
  104 |     await page.fill('input[placeholder*="Name"]', TEST_USERS.newUser.name);
  105 |     await page.fill('input[type="email"]', TEST_USERS.newUser.email);
  106 |     await page.fill('input[type="password"]', TEST_USERS.newUser.password);
  107 |     await page.click('button[type="submit"]');
  108 |     
  109 |     // Should login automatically after registration
  110 |     await expect(page).toHaveURL('/');
  111 |     await expect(page.locator('text=Logout')).toBeVisible();
  112 |   });
  113 |
  114 |   test('should not register user with existing email', async ({ page }) => {
  115 |     await page.click('text=Login');
  116 |     await page.click('text=Sign up');
  117 |     
> 118 |     await page.fill('input[placeholder*="Name"]', 'Another User');
      |                ^ TimeoutError: page.fill: Timeout 5000ms exceeded.
  119 |     await page.fill('input[type="email"]', TEST_USERS.customer.email); // Existing email
  120 |     await page.fill('input[type="password"]', 'password123');
  121 |     await page.click('button[type="submit"]');
  122 |     
  123 |     // Should show error about existing email
  124 |     await expect(page.locator('text=already exists')).toBeVisible();
  125 |   });
  126 |
  127 |   test('should toggle password visibility', async ({ page }) => {
  128 |     await page.click('text=Login');
  129 |     
  130 |     const passwordInput = page.locator('input[type="password"]');
  131 |     const toggleButton = page.locator('[data-testid="toggle-password"]');
  132 |     
  133 |     // Initially password should be hidden
  134 |     await expect(passwordInput).toHaveAttribute('type', 'password');
  135 |     
  136 |     // Click toggle to show password
  137 |     await toggleButton.click();
  138 |     await expect(passwordInput).toHaveAttribute('type', 'text');
  139 |     
  140 |     // Click toggle to hide password again
  141 |     await toggleButton.click();
  142 |     await expect(passwordInput).toHaveAttribute('type', 'password');
  143 |   });
  144 | });
  145 |
```