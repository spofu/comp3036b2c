import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take a screenshot with timestamp
   */
  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    await this.page.screenshot({ 
      path: `tests/test-results/screenshots/${name}-${timestamp}.png` 
    });
  }

  /**
   * Check if element exists and is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await expect(this.page.locator(selector)).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Fill form field with error handling
   */
  async fillField(selector: string, value: string) {
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.fill(selector, value);
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string) {
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.click(selector);
  }
}

export const createTestHelpers = (page: Page) => new TestHelpers(page);
