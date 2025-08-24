import { Page, expect } from '@playwright/test'

/**
 * Test helper functions for common operations
 */
export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForLoadState('domcontentloaded')
  }

  /**
   * Mock authentication as specific user role
   */
  async mockAuth(role: 'SUPER_ADMIN' | 'ADMIN' | 'USER' = 'SUPER_ADMIN') {
    await this.page.addInitScript(() => {
      window.localStorage.setItem('mock-auth', JSON.stringify({
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          role: role
        },
        status: 'authenticated'
      }))
    })
  }

  /**
   * Mock API response
   */
  async mockApiResponse(url: string, response: any, status: number = 200) {
    await this.page.route(url, async route => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })
  }

  /**
   * Mock API error
   */
  async mockApiError(url: string, errorCode: string, message: string, status: number = 400) {
    await this.page.route(url, async route => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: errorCode,
            message: message
          }
        })
      })
    })
  }

  /**
   * Mock slow API response
   */
  async mockSlowApiResponse(url: string, response: any, delay: number = 1000) {
    await this.page.route(url, async route => {
      await new Promise(resolve => setTimeout(resolve, delay))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })
  }

  /**
   * Fill form fields
   */
  async fillForm(fields: Record<string, string>) {
    for (const [selector, value] of Object.entries(fields)) {
      const element = this.page.locator(selector)
      await element.fill(value)
    }
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, optionValue: string) {
    await this.page.locator(selector).click()
    await this.page.locator(`[data-value="${optionValue}"]`).click()
  }

  /**
   * Click button and wait for response
   */
  async clickAndWait(selector: string, waitFor?: string) {
    await this.page.locator(selector).click()
    
    if (waitFor) {
      await this.page.waitForSelector(waitFor)
    }
  }

  /**
   * Accept confirmation dialog
   */
  async acceptDialog() {
    this.page.on('dialog', dialog => dialog.accept())
  }

  /**
   * Dismiss confirmation dialog
   */
  async dismissDialog() {
    this.page.on('dialog', dialog => dialog.dismiss())
  }

  /**
   * Wait for toast message
   */
  async waitForToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const toast = this.page.locator(`[data-testid="toast-${type}"]:has-text("${message}")`)
    await expect(toast).toBeVisible()
  }

  /**
   * Check if element has specific class
   */
  async hasClass(selector: string, className: string) {
    const element = this.page.locator(selector)
    await expect(element).toHaveClass(new RegExp(className))
  }

  /**
   * Check if element is disabled
   */
  async isDisabled(selector: string) {
    const element = this.page.locator(selector)
    await expect(element).toBeDisabled()
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(selector: string) {
    const element = this.page.locator(selector)
    await expect(element).toBeEnabled()
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    })
  }

  /**
   * Wait for loading state to complete
   */
  async waitForLoadingComplete() {
    await this.page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden' })
  }

  /**
   * Check form validation state
   */
  async checkFormValidation(expectedErrors: string[]) {
    for (const error of expectedErrors) {
      await expect(this.page.locator(`text=${error}`)).toBeVisible()
    }
  }

  /**
   * Check form success state
   */
  async checkFormSuccess() {
    await expect(this.page.locator('text=Form siap untuk disubmit')).toBeVisible()
  }

  /**
   * Navigate to specific page
   */
  async navigateTo(path: string) {
    await this.page.goto(path)
    await this.waitForPageLoad()
  }

  /**
   * Reload page and wait for load
   */
  async reloadPage() {
    await this.page.reload()
    await this.waitForPageLoad()
  }

  /**
   * Set viewport size
   */
  async setViewport(width: number, height: number) {
    await this.page.setViewportSize({ width, height })
  }

  /**
   * Mock network conditions
   */
  async mockNetworkConditions(offline: boolean = false, latency: number = 0) {
    await this.page.context().setExtraHTTPHeaders({
      'x-mock-offline': offline.toString(),
      'x-mock-latency': latency.toString()
    })
  }
}

/**
 * Create test helper instance
 */
export function createTestHelpers(page: Page) {
  return new TestHelpers(page)
}

/**
 * Common test data
 */
export const testData = {
  rombel: {
    name: 'A',
    maxStudents: '30',
    updateName: 'B',
    updateMaxStudents: '35'
  },
  user: {
    superAdmin: {
      id: 'super-admin-id',
      name: 'Super Administrator',
      email: 'superadmin@test.com',
      role: 'SUPER_ADMIN'
    },
    admin: {
      id: 'admin-id',
      name: 'Administrator',
      email: 'admin@test.com',
      role: 'ADMIN'
    },
    user: {
      id: 'user-id',
      name: 'Regular User',
      email: 'user@test.com',
      role: 'USER'
    }
  },
  api: {
    success: {
      create: {
        id: 'new-rombel-id',
        name: 'A',
        maxStudents: 30,
        currentStudents: 0,
        isActive: true
      },
      update: {
        id: 'existing-rombel-id',
        name: 'B',
        maxStudents: 35,
        currentStudents: 15,
        isActive: true
      },
      delete: {
        success: true,
        message: 'Rombel berhasil dihapus'
      }
    },
    errors: {
      forbidden: {
        code: 'FORBIDDEN',
        message: 'Anda tidak memiliki akses ke fitur ini'
      },
      notFound: {
        code: 'NOT_FOUND',
        message: 'Rombel tidak ditemukan'
      },
      badRequest: {
        code: 'BAD_REQUEST',
        message: 'Tidak dapat menghapus rombel yang masih memiliki siswa'
      },
      conflict: {
        code: 'CONFLICT',
        message: 'Rombel A sudah ada di kelas ini'
      }
    }
  }
}

/**
 * Common selectors
 */
export const selectors = {
  modal: {
    container: '[data-testid="rombel-modal"]',
    title: '[data-testid="modal-title"]',
    close: '[data-testid="close-button"]'
  },
  form: {
    nameSelect: '[data-testid="rombel-name-select"]',
    maxStudentsInput: '[data-testid="max-students-input"]',
    submitButton: '[data-testid="submit-button"]',
    cancelButton: '[data-testid="cancel-button"]'
  },
  table: {
    row: '[data-testid="rombel-row-{id}"]',
    editButton: '[data-testid="edit-rombel-{id}"]',
    deleteButton: '[data-testid="delete-rombel-{id}"]'
  },
  status: {
    bar: '[data-testid="status-bar"]',
    refreshButton: '[data-testid="refresh-button"]',
    loadingSpinner: '[data-testid="loading-spinner"]'
  }
}
