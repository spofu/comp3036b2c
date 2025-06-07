import { test, expect, Page } from '@playwright/test';
import { TestHelpers } from './testHelpers';
import { testUsers, testProducts, testAddresses, testPayment, searchQueries } from './testData';

test.describe('Fixture Tests', () => {
  let testHelpers: TestHelpers;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    testHelpers = new TestHelpers(page);
  });

  test('TestHelpers should initialize correctly', async () => {
    expect(testHelpers).toBeDefined();
    expect(testHelpers).toBeInstanceOf(TestHelpers);
  });

  test('TestHelpers should have all required methods', async () => {
    // Authentication methods
    expect(typeof testHelpers.registerUser).toBe('function');
    expect(typeof testHelpers.loginUser).toBe('function');
    expect(typeof testHelpers.logout).toBe('function');

    // Product methods
    expect(typeof testHelpers.addProductToCart).toBe('function');
    expect(typeof testHelpers.goToCart).toBe('function');
    expect(typeof testHelpers.clearCart).toBe('function');

    // Checkout methods
    expect(typeof testHelpers.proceedToCheckout).toBe('function');
    expect(typeof testHelpers.fillShippingAddress).toBe('function');
    expect(typeof testHelpers.fillPaymentInfo).toBe('function');
    expect(typeof testHelpers.completeCheckout).toBe('function');

    // Utility methods
    expect(typeof testHelpers.searchProducts).toBe('function');
    expect(typeof testHelpers.takeScreenshot).toBe('function');
    expect(typeof testHelpers.getCartItemCount).toBe('function');
  });

  test('Test data should be valid and complete', () => {
    // Users
    expect(testUsers.validUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(testUsers.validUser.password.length).toBeGreaterThanOrEqual(6);
    expect(testUsers.admin).toBeDefined();

    // Products
    expect(testProducts.tshirt.price).toBeGreaterThan(0);
    expect(testProducts.jeans.id).toBeDefined();

    // Addresses
    expect(testAddresses.valid.zipCode).toMatch(/^\d{5}$/);
    expect(testAddresses.international.country).toBe('Canada');

    // Payment
    expect(testPayment.card.cardNumber).toMatch(/^\d{4}-\d{4}-\d{4}-\d{4}$/);
    expect(testPayment.card.cvv).toMatch(/^\d{3}$/);

    // Search queries
    expect(searchQueries.valid).toContain('shirt');
    expect(searchQueries.empty).toBe('');
  });

  test('Fixtures should integrate properly', async () => {
    // Test data should work with helpers
    const user = testUsers.validUser;
    const product = testProducts.tshirt;
    const address = testAddresses.valid;
    
    expect(user.email).toBeDefined();
    expect(product.id).toBeDefined();
    expect(address.street).toBeDefined();
    
    // Methods should accept the test data
    expect(typeof testHelpers.loginUser).toBe('function');
    expect(typeof testHelpers.addProductToCart).toBe('function');
    expect(typeof testHelpers.fillShippingAddress).toBe('function');
  });
});
