import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access protected dashboard route
    await page.goto('/dashboard/users');
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/auth\/signin/);
    
    // Should show login form
    await expect(page.locator('h1')).toContainText('Masuk ke Akun');
  });

  test('should allow admin users to access dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/signin');
    
    // Wait for login form
    await page.waitForSelector('input[type="email"]');
    
    // Fill login form with admin credentials
    await page.fill('input[type="email"]', 'superadmin@smauiiyk.sch.id');
    await page.fill('input[type="password"]', 'admin123');
    
    // Click sign in button
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await page.waitForURL('/dashboard');
    
    // Verify we're logged in
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Should be able to navigate to users page
    await page.goto('/dashboard/users');
    await expect(page.locator('h1')).toContainText('Manajemen Pengguna');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/signin');
    
    // Wait for login form
    await page.waitForSelector('input[type="email"]');
    
    // Fill login form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Click sign in button
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should maintain session after successful login', async ({ page }) => {
    // Login first
    await page.goto('/auth/signin');
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', 'superadmin@smauiiyk.sch.id');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    
    // Navigate to different dashboard pages
    await page.goto('/dashboard/school-management');
    await expect(page.locator('h1')).toContainText('Manajemen Sekolah');
    
    await page.goto('/dashboard/users');
    await expect(page.locator('h1')).toContainText('Manajemen Pengguna');
    
    // Should still be logged in
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should handle logout correctly', async ({ page }) => {
    // Login first
    await page.goto('/auth/signin');
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', 'superadmin@smauiiyk.sch.id');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    
    // Find and click logout button (assuming it's in the sidebar)
    const logoutButton = page.locator('button:has-text("Keluar")').or(page.locator('a:has-text("Logout")'));
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/auth\/signin/);
    
    // Try to access protected route again
    await page.goto('/dashboard/users');
    
    // Should redirect back to login
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
});
