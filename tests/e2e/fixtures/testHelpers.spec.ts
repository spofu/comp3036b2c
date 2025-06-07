import { test, expect, Page } from '@playwright/test';
import { TestHelpers } from './testHelpers';

// Simplified test suite for TestHelpers class
test.describe('TestHelpers Class', () => {
  let testHelpers: TestHelpers;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    testHelpers = new TestHelpers(page);
  });

  test('should initialize properly with page instance', async () => {
    expect(testHelpers).toBeDefined();
    expect(testHelpers).toBeInstanceOf(TestHelpers);
  });

  test('should have all required authentication methods', () => {
    expect(typeof testHelpers.registerUser).toBe('function');
    expect(typeof testHelpers.loginUser).toBe('function');
    expect(typeof testHelpers.logout).toBe('function');
  });

  test('should have all required cart and checkout methods', () => {
    expect(typeof testHelpers.addProductToCart).toBe('function');
    expect(typeof testHelpers.goToCart).toBe('function');
    expect(typeof testHelpers.proceedToCheckout).toBe('function');
    expect(typeof testHelpers.fillShippingAddress).toBe('function');
    expect(typeof testHelpers.fillPaymentInfo).toBe('function');
    expect(typeof testHelpers.completeCheckout).toBe('function');
  });

  test('should have all required utility and verification methods', () => {
    expect(typeof testHelpers.searchProducts).toBe('function');
    expect(typeof testHelpers.navigateToCategory).toBe('function');
    expect(typeof testHelpers.verifyProductInCart).toBe('function');
    expect(typeof testHelpers.verifyCartTotal).toBe('function');
    expect(typeof testHelpers.takeScreenshot).toBe('function');
    expect(typeof testHelpers.waitForNetworkIdle).toBe('function');
  });
});
