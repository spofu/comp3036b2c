import { Page, expect } from '@playwright/test';
import { testUsers, testAddresses, testPayment } from './testData';

export class TestHelpers {
  constructor(private page: Page) {}

  // Authentication helpers
  async registerUser(user = testUsers.validUser) {
    await this.page.goto('/');
    await this.page.click('[data-testid="login-button"]');
    await this.page.click('[data-testid="switch-to-register"]');
    
    await this.page.fill('[data-testid="register-name"]', user.name);
    await this.page.fill('[data-testid="register-email"]', user.email);
    await this.page.fill('[data-testid="register-password"]', user.password);
    
    await this.page.click('[data-testid="register-submit"]');
    
    // Wait for successful registration
    await expect(this.page.locator('[data-testid="success-message"]')).toBeVisible();
  }

  async loginUser(user = testUsers.validUser) {
    await this.page.goto('/');
    await this.page.click('[data-testid="login-button"]');
    
    await this.page.fill('[data-testid="login-email"]', user.email);
    await this.page.fill('[data-testid="login-password"]', user.password);
    
    await this.page.click('[data-testid="login-submit"]');
    
    // Wait for successful login
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible();
  }

  async logout() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    
    // Verify logout
    await expect(this.page.locator('[data-testid="login-button"]')).toBeVisible();
  }

  // Product helpers
  async addProductToCart(productId: string, quantity = 1, size = 'M', color = 'Red') {
    await this.page.goto(`/product/${productId}`);
    
    if (await this.page.locator('[data-testid="size-selector"]').isVisible()) {
      await this.page.selectOption('[data-testid="size-selector"]', size);
    }
    
    if (await this.page.locator('[data-testid="color-selector"]').isVisible()) {
      await this.page.selectOption('[data-testid="color-selector"]', color);
    }

    // Set quantity
    await this.page.fill('[data-testid="quantity-input"]', quantity.toString());
    
    await this.page.click('[data-testid="add-to-cart"]');
    
    // Wait for success message
    await expect(this.page.locator('[data-testid="cart-success"]')).toBeVisible();
  }

  async goToCart() {
    await this.page.click('[data-testid="cart-icon"]');
    await expect(this.page).toHaveURL('/cart');
  }

  async updateCartItemQuantity(itemId: string, newQuantity: number) {
    const quantityInput = this.page.locator(`[data-testid="cart-item-${itemId}"] [data-testid="quantity-input"]`);
    await quantityInput.fill(newQuantity.toString());
    await this.page.keyboard.press('Enter');
    
    // Wait for update
    await this.page.waitForTimeout(1000);
  }

  async removeCartItem(itemId: string) {
    await this.page.click(`[data-testid="cart-item-${itemId}"] [data-testid="remove-button"]`);
    
    // Wait for removal
    await expect(this.page.locator(`[data-testid="cart-item-${itemId}"]`)).not.toBeVisible();
  }

  async clearCart() {
    await this.goToCart();
    await this.page.click('[data-testid="clear-cart"]');
    
    // Confirm if there's a confirmation dialog
    if (await this.page.locator('[data-testid="confirm-clear"]').isVisible()) {
      await this.page.click('[data-testid="confirm-clear"]');
    }
    
    await expect(this.page.locator('[data-testid="empty-cart"]')).toBeVisible();
  }

  // Checkout helpers
  async proceedToCheckout() {
    await this.goToCart();
    await this.page.click('[data-testid="checkout-button"]');
    await expect(this.page).toHaveURL('/checkout');
  }

  async fillShippingAddress(address = testAddresses.valid) {
    await this.page.fill('[data-testid="shipping-street"]', address.street);
    await this.page.fill('[data-testid="shipping-apartment"]', address.apartment);
    await this.page.fill('[data-testid="shipping-city"]', address.city);
    await this.page.fill('[data-testid="shipping-state"]', address.state);
    await this.page.fill('[data-testid="shipping-zipcode"]', address.zipCode);
    await this.page.fill('[data-testid="shipping-country"]', address.country);
  }

  async fillPaymentInfo(payment = testPayment.card) {
    await this.page.selectOption('[data-testid="payment-method"]', payment.method);
    await this.page.fill('[data-testid="card-number"]', payment.cardNumber);
    await this.page.fill('[data-testid="card-expiry"]', payment.expiryDate);
    await this.page.fill('[data-testid="card-cvv"]', payment.cvv);
    await this.page.fill('[data-testid="card-name"]', payment.name);
  }

  async completeCheckout() {
    await this.page.click('[data-testid="place-order"]');
    
    // Wait for order confirmation
    await expect(this.page.locator('[data-testid="order-success"]')).toBeVisible();
    
    // Extract order number if available
    const orderNumberElement = await this.page.locator('[data-testid="order-number"]');
    return await orderNumberElement.textContent();
  }

  // Search helpers
  async searchProducts(query: string) {
    await this.page.click('[data-testid="search-input"]');
    await this.page.fill('[data-testid="search-input"]', query);
    await this.page.keyboard.press('Enter');
    
    // Wait for search results
    await this.page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });
  }

  async waitForSearchSuggestions() {
    await this.page.waitForSelector('[data-testid="search-suggestions"]', { timeout: 3000 });
  }

  // Navigation helpers
  async navigateToCategory(category: string) {
    await this.page.goto('/');
    await this.page.click(`[data-testid="category-${category.toLowerCase()}"]`);
  }

  async navigateToProduct(productId: string) {
    await this.page.goto(`/product/${productId}`);
  }

  // Verification helpers
  async verifyProductInCart(productName: string) {
    await this.goToCart();
    await expect(this.page.locator(`text=${productName}`)).toBeVisible();
  }

  async verifyCartTotal(expectedTotal: string) {
    await expect(this.page.locator('[data-testid="cart-total"]')).toHaveText(expectedTotal);
  }

  async verifyEmptyCart() {
    await this.goToCart();
    await expect(this.page.locator('[data-testid="empty-cart"]')).toBeVisible();
  }

  async verifyOrderInHistory(orderNumber: string) {
    await this.page.goto('/orders');
    await expect(this.page.locator(`text=${orderNumber}`)).toBeVisible();
  }

  // Utility helpers
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png`, fullPage: true });
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async mockAPIResponse(url: string, response: any) {
    await this.page.route(url, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  async interceptAPICall(url: string) {
    const responsePromise = this.page.waitForResponse(url);
    return responsePromise;
  }

  async getCartItemCount(): Promise<number> {
    const cartBadge = this.page.locator('[data-testid="cart-count"]');
    if (await cartBadge.isVisible()) {
      const count = await cartBadge.textContent();
      return parseInt(count || '0');
    }
    return 0;
  }

  async selectRandomProduct(): Promise<string> {
    await this.page.goto('/');
    const products = await this.page.locator('[data-testid^="product-card-"]').all();
    
    if (products.length === 0) {
      throw new Error('No products found on the page');
    }
    
    const randomIndex = Math.floor(Math.random() * products.length);
    const randomProduct = products[randomIndex];
    
    // Extract product ID from the data-testid
    const productId = await randomProduct.getAttribute('data-testid');
    return productId?.replace('product-card-', '') || '1';
  }

  // Error handling helpers
  async expectErrorMessage(message: string) {
    await expect(this.page.locator('[data-testid="error-message"]')).toContainText(message);
  }

  async expectSuccessMessage(message: string) {
    await expect(this.page.locator('[data-testid="success-message"]')).toContainText(message);
  }

  // Mobile helpers
  async openMobileMenu() {
    await this.page.click('[data-testid="mobile-menu-toggle"]');
  }

  async closeMobileMenu() {
    await this.page.click('[data-testid="mobile-menu-close"]');
  }
}