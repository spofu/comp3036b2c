# Test info

- Name: TestHelpers Class >> should have all required authentication methods
- Location: /workspaces/javascript-node-postgres-Comp3036Major/comp3036b2c/tests/e2e/fixtures/testHelpers.spec.ts:19:7

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