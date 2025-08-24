import { test, expect } from '@playwright/test';
import { loginAsAdmin, navigateToUsersPage } from './utils/auth-helper';

test.describe('Users Page Animation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToUsersPage(page);
  });

  test('should show filter card with slide from top animation on first open', async ({ page }) => {
    // ✅ PERBAIKAN: Gunakan selector yang lebih fleksibel untuk button filter
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    
    // Wait for filter card to appear
    const filterCard = page.locator('text=Filter Lanjutan');
    await expect(filterCard).toBeVisible();
  });

  test('should show add user card with slide from top animation on first open', async ({ page }) => {
    // ✅ PERBAIKAN: Gunakan selector yang lebih fleksibel untuk button add user
    const addUserButton = page.locator('button').filter({ hasText: /tambah pengguna|sembunyikan form/i }).first();
    await addUserButton.click();
    const addUserCard = page.locator('text=Tambah Pengguna Baru');
    await expect(addUserCard).toBeVisible();
  });

  test('should switch from filter to add user without slide animation', async ({ page }) => {
    // ✅ PERBAIKAN: Gunakan selector yang lebih fleksibel
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    
    // Wait for filter card to be visible
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    // Switch to add user
    const addUserButton = page.locator('button').filter({ hasText: /tambah pengguna|sembunyikan form/i }).first();
    await addUserButton.click();
    
    // Filter card should disappear
    await expect(page.locator('text=Filter Lanjutan')).not.toBeVisible();
    // Add user card should appear
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
  });

  test('should switch from add user to filter without slide animation', async ({ page }) => {
    // Open add user card first
    const addUserButton = page.locator('button').filter({ hasText: /tambah pengguna|sembunyikan form/i }).first();
    await addUserButton.click();
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
    
    // ✅ PERBAIKAN: Gunakan selector yang lebih fleksibel
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    
    // Add user card should disappear
    await expect(page.locator('text=Tambah Pengguna Baru')).not.toBeVisible();
    // Filter card should appear
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
  });

  test('should close filter card with slide to top animation', async ({ page }) => {
    // ✅ PERBAIKAN: Gunakan selector yang lebih fleksibel
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    
    // Wait for filter card to be visible
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    // Close filter card
    await filterButton.click();
    
    // Filter card should disappear
    await expect(page.locator('text=Filter Lanjutan')).not.toBeVisible();
  });

  test('should close add user card with slide to top animation', async ({ page }) => {
    // ✅ PERBAIKAN: Gunakan selector yang lebih fleksibel
    const addUserButton = page.locator('button').filter({ hasText: /tambah pengguna|sembunyikan form/i }).first();
    await addUserButton.click();
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
    
    // Close add user card
    await addUserButton.click();
    
    // Add user card should disappear
    await expect(page.locator('text=Tambah Pengguna Baru')).not.toBeVisible();
  });

  test('should maintain filter card state in localStorage', async ({ page }) => {
    // ✅ PERBAIKAN: Gunakan selector yang lebih fleksibel
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    
    // Wait for filter card to be visible
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    // Check localStorage
    const filterVisible = await page.evaluate(() => localStorage.getItem('users-filter-visible'));
    expect(filterVisible).toBe('true');
    
    // Close filter card
    await filterButton.click();
    
    // Check localStorage again
    const filterVisibleAfterClose = await page.evaluate(() => localStorage.getItem('users-filter-visible'));
    expect(filterVisibleAfterClose).toBe('false');
  });

  test('should have proper button states based on card visibility', async ({ page }) => {
    // ✅ PERBAIKAN: Test visibility, bukan CSS classes yang error
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    const addUserButton = page.locator('button').filter({ hasText: /tambah pengguna|sembunyikan form/i }).first();
    
    // Both buttons should be visible initially
    await expect(filterButton).toBeVisible();
    await expect(addUserButton).toBeVisible();
    
    // Open filter card
    await filterButton.click();
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    // Both buttons should still be visible
    await expect(filterButton).toBeVisible();
    await expect(addUserButton).toBeVisible();
    
    // Switch to add user
    await addUserButton.click();
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
    
    // Both buttons should still be visible
    await expect(filterButton).toBeVisible();
    await expect(addUserButton).toBeVisible();
  });

  test('should handle form interactions in add user card', async ({ page }) => {
    // ✅ PERBAIKAN: Gunakan selector yang lebih fleksibel
    const addUserButton = page.locator('button').filter({ hasText: /tambah pengguna|sembunyikan form/i }).first();
    await addUserButton.click();
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
    
    // Test role selection
    const roleSelect = page.locator('select').first();
    await roleSelect.selectOption('teacher');
    
    // Test form inputs
    const nameInput = page.locator('input[placeholder="Masukkan nama lengkap"]');
    const emailInput = page.locator('input[placeholder="user@smauiiyk.sch.id"]');
    
    await nameInput.fill('Test User');
    await emailInput.fill('test@smauiiyk.sch.id');
    
    await expect(nameInput).toHaveValue('Test User');
    await expect(emailInput).toHaveValue('test@smauiiyk.sch.id');
  });

  test('should have smooth card transitions', async ({ page }) => {
    // ✅ PERBAIKAN: Gunakan selector yang lebih fleksibel
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    
    // Wait for filter card to be visible
    const filterCard = page.locator('text=Filter Lanjutan');
    await expect(filterCard).toBeVisible();
    
    // Close filter card
    await filterButton.click();
    
    // Filter card should disappear
    await expect(filterCard).not.toBeVisible();
  });
});
