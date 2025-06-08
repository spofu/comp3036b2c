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
      await expect(this.page.locator(selector)).toBeVisible({ timeout: 8000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Fill form field with error handling
   */
  async fillField(selector: string, value: string) {
    try {
      await this.page.waitForSelector(selector, { timeout: 15000 });
      await this.page.fill(selector, value);
    } catch (error) {
      console.log(`⚠️ Could not fill field ${selector}: ${error}`);
      throw error;
    }
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string) {
    try {
      await this.page.waitForSelector(selector, { timeout: 15000 });
      await this.page.click(selector);
    } catch (error) {
      console.log(`⚠️ Could not click element ${selector}: ${error}`);
      throw error;
    }
  }
}

export const createTestHelpers = (page: Page) => new TestHelpers(page);
