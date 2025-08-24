import { Page, expect } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  // Navigate to login page
  await page.goto('/auth/signin');
  
  // Wait for login form
  await page.waitForSelector('input[type="email"]');
  
  // Fill login form
  await page.fill('input[type="email"]', 'superadmin@smauiiyk.sch.id');
  await page.fill('input[type="password"]', 'admin123');
  
  // Click sign in button
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard');
  
  // Verify we're logged in
  await expect(page.locator('h1')).toContainText('Dashboard');
}

export async function setupAuthState(page: Page) {
  // Set authentication cookies manually for testing
  await page.addInitScript(() => {
    // Mock session data
    (window as any).mockSession = {
      user: {
        id: 'test-admin-id',
        email: 'superadmin@smauiiyk.sch.id',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        permissions: ['*']
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    // Mock NextAuth session
    (window as any).__NEXT_DATA__ = {
      props: {
        session: (window as any).mockSession
      }
    };
  });
  
  // Set localStorage for auth state
  await page.evaluate(() => {
    localStorage.setItem('next-auth.session-token', 'mock-session-token');
    localStorage.setItem('next-auth.csrf-token', 'mock-csrf-token');
  });
}

export async function navigateToUsersPage(page: Page) {
  // Navigate to users page
  await page.goto('/dashboard/users?tab=student');
  
  // Wait for page to load
  await page.waitForSelector('h1:has-text("Manajemen Pengguna")', { timeout: 10000 });
  
  // Verify we're on the right page
  await expect(page.locator('h1')).toContainText('Manajemen Pengguna');
}
