# Test info

- Name: Fixture Tests >> TestHelpers should initialize correctly
- Location: /workspaces/javascript-node-postgres-Comp3036Major/comp3036b2c/tests/e2e/fixtures/fixtures.spec.ts:14:7

# Error details

```
Error: browserType.launch: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libX11-xcb.so.1                                  ║
║     libXrandr.so.2                                   ║
║     libXcomposite.so.1                               ║
║     libXcursor.so.1                                  ║
║     libXdamage.so.1                                  ║
║     libXfixes.so.3                                   ║
║     libXi.so.6                                       ║
║     libgtk-3.so.0                                    ║
║     libgdk-3.so.0                                    ║
║     libatk-1.0.so.0                                  ║
║     libasound.so.2                                   ║
║     libdbus-1.so.3                                   ║
╚══════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test, expect, Page } from '@playwright/test';
   2 | import { TestHelpers } from './testHelpers';
   3 | import { testUsers, testProducts, testAddresses, testPayment, searchQueries } from './testData';
   4 |
   5 | test.describe('Fixture Tests', () => {
   6 |   let testHelpers: TestHelpers;
   7 |   let page: Page;
   8 |
   9 |   test.beforeEach(async ({ page: testPage }) => {
  10 |     page = testPage;
  11 |     testHelpers = new TestHelpers(page);
  12 |   });
  13 |
> 14 |   test('TestHelpers should initialize correctly', async () => {
     |       ^ Error: browserType.launch: 
  15 |     expect(testHelpers).toBeDefined();
  16 |     expect(testHelpers).toBeInstanceOf(TestHelpers);
  17 |   });
  18 |
  19 |   test('TestHelpers should have all required methods', async () => {
  20 |     // Authentication methods
  21 |     expect(typeof testHelpers.registerUser).toBe('function');
  22 |     expect(typeof testHelpers.loginUser).toBe('function');
  23 |     expect(typeof testHelpers.logout).toBe('function');
  24 |
  25 |     // Product methods
  26 |     expect(typeof testHelpers.addProductToCart).toBe('function');
  27 |     expect(typeof testHelpers.goToCart).toBe('function');
  28 |     expect(typeof testHelpers.clearCart).toBe('function');
  29 |
  30 |     // Checkout methods
  31 |     expect(typeof testHelpers.proceedToCheckout).toBe('function');
  32 |     expect(typeof testHelpers.fillShippingAddress).toBe('function');
  33 |     expect(typeof testHelpers.fillPaymentInfo).toBe('function');
  34 |     expect(typeof testHelpers.completeCheckout).toBe('function');
  35 |
  36 |     // Utility methods
  37 |     expect(typeof testHelpers.searchProducts).toBe('function');
  38 |     expect(typeof testHelpers.takeScreenshot).toBe('function');
  39 |     expect(typeof testHelpers.getCartItemCount).toBe('function');
  40 |   });
  41 |
  42 |   test('Test data should be valid and complete', () => {
  43 |     // Users
  44 |     expect(testUsers.validUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  45 |     expect(testUsers.validUser.password.length).toBeGreaterThanOrEqual(6);
  46 |     expect(testUsers.admin).toBeDefined();
  47 |
  48 |     // Products
  49 |     expect(testProducts.tshirt.price).toBeGreaterThan(0);
  50 |     expect(testProducts.jeans.id).toBeDefined();
  51 |
  52 |     // Addresses
  53 |     expect(testAddresses.valid.zipCode).toMatch(/^\d{5}$/);
  54 |     expect(testAddresses.international.country).toBe('Canada');
  55 |
  56 |     // Payment
  57 |     expect(testPayment.card.cardNumber).toMatch(/^\d{4}-\d{4}-\d{4}-\d{4}$/);
  58 |     expect(testPayment.card.cvv).toMatch(/^\d{3}$/);
  59 |
  60 |     // Search queries
  61 |     expect(searchQueries.valid).toContain('shirt');
  62 |     expect(searchQueries.empty).toBe('');
  63 |   });
  64 |
  65 |   test('Fixtures should integrate properly', async () => {
  66 |     // Test data should work with helpers
  67 |     const user = testUsers.validUser;
  68 |     const product = testProducts.tshirt;
  69 |     const address = testAddresses.valid;
  70 |     
  71 |     expect(user.email).toBeDefined();
  72 |     expect(product.id).toBeDefined();
  73 |     expect(address.street).toBeDefined();
  74 |     
  75 |     // Methods should accept the test data
  76 |     expect(typeof testHelpers.loginUser).toBe('function');
  77 |     expect(typeof testHelpers.addProductToCart).toBe('function');
  78 |     expect(typeof testHelpers.fillShippingAddress).toBe('function');
  79 |   });
  80 | });
  81 |
```