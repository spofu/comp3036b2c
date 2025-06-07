# Test info

- Name: Fixture Integration Tests >> fixtures should work together for complete shopping flow
- Location: /workspaces/javascript-node-postgres-Comp3036Major/comp3036b2c/tests/e2e/fixtures/integration.spec.ts:29:7

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