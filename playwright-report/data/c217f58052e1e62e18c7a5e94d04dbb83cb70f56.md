# Test info

- Name: Fixture Integration Tests >> fixtures should work together for complete shopping flow
- Location: /workspaces/javascript-node-postgres-Comp3036Major/comp3036b2c/tests/e2e/fixtures/integration.spec.ts:29:7

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
   5 | // Simplified integration tests for fixtures working together
   6 | test.describe('Fixture Integration Tests', () => {
   7 |   let testHelpers: TestHelpers;
   8 |   let page: Page;
   9 |
  10 |   test.beforeEach(async ({ page: testPage }) => {
  11 |     page = testPage;
  12 |     testHelpers = new TestHelpers(page);
  13 |   });
  14 |
  15 |   test('fixtures should work together for complete user registration flow', async () => {
  16 |     const user = testUsers.validUser;
  17 |     
  18 |     // Verify test data is available
  19 |     expect(user.name).toBeDefined();
  20 |     expect(user.email).toBeDefined();
  21 |     expect(user.password).toBeDefined();
  22 |     
  23 |     // Verify helper methods exist for the workflow
  24 |     expect(typeof testHelpers.registerUser).toBe('function');
  25 |     expect(typeof testHelpers.loginUser).toBe('function');
  26 |     expect(typeof testHelpers.logout).toBe('function');
  27 |   });
  28 |
> 29 |   test('fixtures should work together for complete shopping flow', async () => {
     |       ^ Error: browserType.launch: 
  30 |     const user = testUsers.validUser;
  31 |     const product = testProducts.tshirt;
  32 |     const address = testAddresses.valid;
  33 |     const payment = testPayment.card;
  34 |     
  35 |     // Verify all necessary data is available
  36 |     expect(user).toBeDefined();
  37 |     expect(product).toBeDefined();
  38 |     expect(address).toBeDefined();
  39 |     expect(payment).toBeDefined();
  40 |     
  41 |     // Verify helper methods exist for shopping workflow
  42 |     expect(typeof testHelpers.loginUser).toBe('function');
  43 |     expect(typeof testHelpers.addProductToCart).toBe('function');
  44 |     expect(typeof testHelpers.proceedToCheckout).toBe('function');
  45 |     expect(typeof testHelpers.fillShippingAddress).toBe('function');
  46 |     expect(typeof testHelpers.fillPaymentInfo).toBe('function');
  47 |     expect(typeof testHelpers.completeCheckout).toBe('function');
  48 |   });
  49 |
  50 |   test('fixtures should work together for search and discovery flow', async () => {
  51 |     const query = searchQueries.valid[0];
  52 |     const product = testProducts.tshirt;
  53 |     
  54 |     // Verify search functionality components
  55 |     expect(query).toBeDefined();
  56 |     expect(product).toBeDefined();
  57 |     expect(typeof testHelpers.searchProducts).toBe('function');
  58 |     expect(typeof testHelpers.navigateToCategory).toBe('function');
  59 |     expect(typeof testHelpers.addProductToCart).toBe('function');
  60 |   });
  61 | });
  62 |
```