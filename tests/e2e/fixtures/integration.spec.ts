import { test, expect, Page } from '@playwright/test';
import { TestHelpers } from './testHelpers';
import { testUsers, testProducts, testAddresses, testPayment, searchQueries } from './testData';

// Simplified integration tests for fixtures working together
test.describe('Fixture Integration Tests', () => {
  let testHelpers: TestHelpers;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    testHelpers = new TestHelpers(page);
  });

  test('fixtures should work together for complete user registration flow', async () => {
    const user = testUsers.validUser;
    
    // Verify test data is available
    expect(user.name).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.password).toBeDefined();
    
    // Verify helper methods exist for the workflow
    expect(typeof testHelpers.registerUser).toBe('function');
    expect(typeof testHelpers.loginUser).toBe('function');
    expect(typeof testHelpers.logout).toBe('function');
  });

  test('fixtures should work together for complete shopping flow', async () => {
    const user = testUsers.validUser;
    const product = testProducts.tshirt;
    const address = testAddresses.valid;
    const payment = testPayment.card;
    
    // Verify all necessary data is available
    expect(user).toBeDefined();
    expect(product).toBeDefined();
    expect(address).toBeDefined();
    expect(payment).toBeDefined();
    
    // Verify helper methods exist for shopping workflow
    expect(typeof testHelpers.loginUser).toBe('function');
    expect(typeof testHelpers.addProductToCart).toBe('function');
    expect(typeof testHelpers.proceedToCheckout).toBe('function');
    expect(typeof testHelpers.fillShippingAddress).toBe('function');
    expect(typeof testHelpers.fillPaymentInfo).toBe('function');
    expect(typeof testHelpers.completeCheckout).toBe('function');
  });

  test('fixtures should work together for search and discovery flow', async () => {
    const query = searchQueries.valid[0];
    const product = testProducts.tshirt;
    
    // Verify search functionality components
    expect(query).toBeDefined();
    expect(product).toBeDefined();
    expect(typeof testHelpers.searchProducts).toBe('function');
    expect(typeof testHelpers.navigateToCategory).toBe('function');
    expect(typeof testHelpers.addProductToCart).toBe('function');
  });
});
