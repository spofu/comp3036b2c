# Test info

- Name: Fixture Tests >> Fixtures should integrate properly
- Location: /workspaces/javascript-node-postgres-Comp3036Major/comp3036b2c/tests/e2e/fixtures/fixtures.spec.ts:65:7

# Error details

```
Error: browserType.launch: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libgstreamer-1.0.so.0                            ║
║     libgtk-4.so.1                                    ║
║     libgraphene-1.0.so.0                             ║
║     libwoff2dec.so.1.0.2                             ║
║     libvpx.so.7                                      ║
║     libopus.so.0                                     ║
║     libgstallocators-1.0.so.0                        ║
║     libgstapp-1.0.so.0                               ║
║     libgstbase-1.0.so.0                              ║
║     libgstpbutils-1.0.so.0                           ║
║     libgstaudio-1.0.so.0                             ║
║     libgsttag-1.0.so.0                               ║
║     libgstvideo-1.0.so.0                             ║
║     libgstgl-1.0.so.0                                ║
║     libgstcodecparsers-1.0.so.0                      ║
║     libgstfft-1.0.so.0                               ║
║     libflite.so.1                                    ║
║     libflite_usenglish.so.1                          ║
║     libflite_cmu_grapheme_lang.so.1                  ║
║     libflite_cmu_grapheme_lex.so.1                   ║
║     libflite_cmu_indic_lang.so.1                     ║
║     libflite_cmu_indic_lex.so.1                      ║
║     libflite_cmulex.so.1                             ║
║     libflite_cmu_time_awb.so.1                       ║
║     libflite_cmu_us_awb.so.1                         ║
║     libflite_cmu_us_kal16.so.1                       ║
║     libflite_cmu_us_kal.so.1                         ║
║     libflite_cmu_us_rms.so.1                         ║
║     libflite_cmu_us_slt.so.1                         ║
║     libavif.so.15                                    ║
║     libharfbuzz-icu.so.0                             ║
║     libepoxy.so.0                                    ║
║     libenchant-2.so.2                                ║
║     libsecret-1.so.0                                 ║
║     libhyphen.so.0                                   ║
║     libwayland-server.so.0                           ║
║     libwayland-egl.so.1                              ║
║     libwayland-client.so.0                           ║
║     libmanette-0.2.so.0                              ║
║     libgbm.so.1                                      ║
║     libdrm.so.2                                      ║
║     libatk-1.0.so.0                                  ║
║     libxkbcommon.so.0                                ║
║     libatk-bridge-2.0.so.0                           ║
║     libGLESv2.so.2                                   ║
║     libx264.so                                       ║
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
  14 |   test('TestHelpers should initialize correctly', async () => {
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
> 65 |   test('Fixtures should integrate properly', async () => {
     |       ^ Error: browserType.launch: 
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