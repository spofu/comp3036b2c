// Test data for e2e tests
export const testUsers = {
  validUser: {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123'
  },
  admin: {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123'
  },
  existingUser: {
    email: 'existing@example.com',
    password: 'password123'
  }
};

export const testProducts = {
  tshirt: {
    id: '1',
    name: 'Premium T-Shirt',
    price: 29.99,
    category: 'Clothing'
  },
  jeans: {
    id: '2', 
    name: 'Classic Jeans',
    price: 89.99,
    category: 'Clothing'
  }
};

export const testAddresses = {
  valid: {
    street: '123 Test Street',
    apartment: 'Apt 4B',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    country: 'United States'
  },
  international: {
    street: '456 International Ave',
    apartment: '',
    city: 'Toronto',
    state: 'Ontario', 
    zipCode: 'M1A 1A1',
    country: 'Canada'
  }
};

export const testPayment = {
  card: {
    method: 'card',
    cardNumber: '4111-1111-1111-1111',
    expiryDate: '12/25',
    cvv: '123',
    name: 'Test User'
  }
};

export const searchQueries = {
  valid: ['shirt', 'premium', 'clothing'],
  invalid: ['xyz123', 'nonexistent'],
  short: 'a',
  empty: ''
};