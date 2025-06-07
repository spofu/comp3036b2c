import { test, expect } from '@playwright/test';
import { testUsers, testProducts, testAddresses, testPayment, searchQueries } from './testData';

// Simplified test suite for validating test data integrity
test.describe('Test Data Validation', () => {
  
  test('test data objects should be properly defined', () => {
    // Check all main data objects exist
    expect(testUsers).toBeDefined();
    expect(testProducts).toBeDefined();
    expect(testAddresses).toBeDefined();
    expect(testPayment).toBeDefined();
    expect(searchQueries).toBeDefined();
    
    // Check essential user data
    expect(testUsers.validUser).toBeDefined();
    expect(testUsers.validUser.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(testUsers.validUser.password.length).toBeGreaterThanOrEqual(6);
    
    // Check essential product data
    expect(testProducts.tshirt).toBeDefined();
    expect(testProducts.tshirt.name).toBeDefined();
    expect(testProducts.tshirt.price).toBeGreaterThan(0);
  });

  test('test data should contain required fields', () => {
    // User validation
    Object.values(testUsers).forEach(user => {
      expect(user.email).toBeDefined();
      expect(user.password).toBeDefined();
    });
    
    // Address validation
    expect(testAddresses.valid.street).toBeDefined();
    expect(testAddresses.valid.city).toBeDefined();
    expect(testAddresses.valid.country).toBeDefined();
    
    // Payment validation
    expect(testPayment.card.cardNumber).toBeDefined();
    expect(testPayment.card.cvv).toBeDefined();
    expect(testPayment.card.expiryDate).toBeDefined();
    
    // Search query validation
    expect(Array.isArray(searchQueries.valid)).toBe(true);
    expect(searchQueries.valid.length).toBeGreaterThan(0);
  });
});
