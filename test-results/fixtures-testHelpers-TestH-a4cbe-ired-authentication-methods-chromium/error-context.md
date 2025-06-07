# Test info

- Name: TestHelpers Class >> should have all required authentication methods
- Location: /workspaces/javascript-node-postgres-Comp3036Major/comp3036b2c/tests/e2e/fixtures/testHelpers.spec.ts:19:7

# Error details

```
Error: browserType.launch: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Please install them with the following command:      ║
║                                                      ║
║     sudo npx playwright install-deps                 ║
║                                                      ║
║ Alternatively, use apt:                              ║
║     sudo apt-get install libnss3\                    ║
║         libnspr4\                                    ║
║         libdbus-1-3\                                 ║
║         libatk1.0-0\                                 ║
║         libatk-bridge2.0-0\                          ║
║         libatspi2.0-0\                               ║
║         libxcomposite1\                              ║
║         libxdamage1\                                 ║
║         libxfixes3\                                  ║
║         libxrandr2\                                  ║
║         libgbm1\                                     ║
║         libxkbcommon0\                               ║
║         libasound2                                   ║
║                                                      ║
║ <3 Playwright Team                                   ║
╚══════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test, expect, Page } from '@playwright/test';
   2 | import { TestHelpers } from './testHelpers';
   3 |
   4 | // Simplified test suite for TestHelpers class
   5 | test.describe('TestHelpers Class', () => {
   6 |   let testHelpers: TestHelpers;
   7 |   let page: Page;
   8 |
   9 |   test.beforeEach(async ({ page: testPage }) => {
  10 |     page = testPage;
  11 |     testHelpers = new TestHelpers(page);
  12 |   });
  13 |
  14 |   test('should initialize properly with page instance', async () => {
  15 |     expect(testHelpers).toBeDefined();
  16 |     expect(testHelpers).toBeInstanceOf(TestHelpers);
  17 |   });
  18 |
> 19 |   test('should have all required authentication methods', () => {
     |       ^ Error: browserType.launch: 
  20 |     expect(typeof testHelpers.registerUser).toBe('function');
  21 |     expect(typeof testHelpers.loginUser).toBe('function');
  22 |     expect(typeof testHelpers.logout).toBe('function');
  23 |   });
  24 |
  25 |   test('should have all required cart and checkout methods', () => {
  26 |     expect(typeof testHelpers.addProductToCart).toBe('function');
  27 |     expect(typeof testHelpers.goToCart).toBe('function');
  28 |     expect(typeof testHelpers.proceedToCheckout).toBe('function');
  29 |     expect(typeof testHelpers.fillShippingAddress).toBe('function');
  30 |     expect(typeof testHelpers.fillPaymentInfo).toBe('function');
  31 |     expect(typeof testHelpers.completeCheckout).toBe('function');
  32 |   });
  33 |
  34 |   test('should have all required utility and verification methods', () => {
  35 |     expect(typeof testHelpers.searchProducts).toBe('function');
  36 |     expect(typeof testHelpers.navigateToCategory).toBe('function');
  37 |     expect(typeof testHelpers.verifyProductInCart).toBe('function');
  38 |     expect(typeof testHelpers.verifyCartTotal).toBe('function');
  39 |     expect(typeof testHelpers.takeScreenshot).toBe('function');
  40 |     expect(typeof testHelpers.waitForNetworkIdle).toBe('function');
  41 |   });
  42 | });
  43 |
```