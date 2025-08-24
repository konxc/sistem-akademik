import { test, expect } from '@playwright/test';
import { loginAsAdmin, navigateToUsersPage } from './utils/auth-helper';

test.describe('Users Page Console Logs and Animation Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToUsersPage(page);
    await page.addInitScript(() => {
      (window as any).consoleLogs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        (window as any).consoleLogs.push(args.join(' '));
        originalLog.apply(console, args);
      };
    });
  });

  test('should log proper animation context for first time filter open', async ({ page }) => {
    // ✅ PERBAIKAN: Gunakan selector yang konsisten dengan test animation
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    const logs = await page.evaluate(() => (window as any).consoleLogs || []);
    
    // Should have filter toggle logs
    const filterToggleLogs = logs.filter(log => log.includes('ToggleFilterCard'));
    expect(filterToggleLogs.length).toBeGreaterThan(0);
    
    // Should log opening action
    const openingLogs = filterToggleLogs.filter(log => log.includes('opening'));
    expect(openingLogs.length).toBeGreaterThan(0);
    
    // Should log first time animation
    const firstTimeLogs = filterToggleLogs.filter(log => log.includes('Slides from top (first time)'));
    expect(firstTimeLogs.length).toBeGreaterThan(0);
  });

  test('should log proper animation context for first time add user open', async ({ page }) => {
    const addUserButton = page.locator('button:has-text("Tambah Pengguna")');
    await addUserButton.click();
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
    
    const logs = await page.evaluate(() => (window as any).consoleLogs || []);
    
    // Should have add user toggle logs
    const addUserToggleLogs = logs.filter(log => log.includes('ToggleAddUserCard'));
    expect(addUserToggleLogs.length).toBeGreaterThan(0);
    
    // Should log opening action
    const openingLogs = addUserToggleLogs.filter(log => log.includes('opening'));
    expect(openingLogs.length).toBeGreaterThan(0);
    
    // Should log first time animation
    const firstTimeLogs = addUserToggleLogs.filter(log => log.includes('Slides from top (first time)'));
    expect(firstTimeLogs.length).toBeGreaterThan(0);
  });

  test('should log proper animation context when switching from filter to add user', async ({ page }) => {
    // Open filter first
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    // Get initial logs
    const logs = await page.evaluate(() => (window as any).consoleLogs || []);
    
    // Switch to add user
    const addUserButton = page.locator('button:has-text("Tambah Pengguna")');
    await addUserButton.click();
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
    
    // Get updated logs
    const updatedLogs = await page.evaluate(() => (window as any).consoleLogs || []);
    
    // Should have new logs
    expect(updatedLogs.length).toBeGreaterThan(logs.length);
    
    // Should have filter toggle logs
    const filterToggleLogs = updatedLogs.filter(log => log.includes('ToggleFilterCard'));
    expect(filterToggleLogs.length).toBeGreaterThan(0);
    
    // Should have add user toggle logs
    const addUserToggleLogs = updatedLogs.filter(log => log.includes('ToggleAddUserCard'));
    expect(addUserToggleLogs.length).toBeGreaterThan(0);
    
    // Should log switching behavior
    const switchingLogs = updatedLogs.filter(log => log.includes('No slide animation (switching)'));
    expect(switchingLogs.length).toBeGreaterThan(0);
  });

  test('should log proper animation context when switching from add user to filter', async ({ page }) => {
    // Open add user first
    const addUserButton = page.locator('button:has-text("Tambah Pengguna")');
    await addUserButton.click();
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
    
    // Get initial logs
    const logs = await page.evaluate(() => (window as any).consoleLogs || []);
    
    // Switch to filter
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    // Get updated logs
    const updatedLogs = await page.evaluate(() => (window as any).consoleLogs || []);
    
    // Should have new logs
    expect(updatedLogs.length).toBeGreaterThan(logs.length);
    
    // Should have add user toggle logs
    const addUserToggleLogs = updatedLogs.filter(log => log.includes('ToggleAddUserCard'));
    expect(addUserToggleLogs.length).toBeGreaterThan(0);
    
    // Should have filter toggle logs
    const filterToggleLogs = updatedLogs.filter(log => log.includes('ToggleFilterCard'));
    expect(filterToggleLogs.length).toBeGreaterThan(0);
    
    // Should log switching behavior
    const switchingLogs = updatedLogs.filter(log => log.includes('No slide animation (switching)'));
    expect(switchingLogs.length).toBeGreaterThan(0);
  });

  test('should log proper button state changes', async ({ page }) => {
    // Get initial logs
    const logs = await page.evaluate(() => (window as any).consoleLogs || []);
    
    // Open filter
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    // Get updated logs
    const updatedLogs = await page.evaluate(() => (window as any).consoleLogs || []);
    
    // Should have new logs
    expect(updatedLogs.length).toBeGreaterThan(logs.length);
    
    // Should have filter toggle logs
    const filterToggleLogs = updatedLogs.filter(log => log.includes('ToggleFilterCard'));
    expect(filterToggleLogs.length).toBeGreaterThan(0);
    
    // Should log state changes
    const stateLogs = updatedLogs.filter(log => log.includes('currentState'));
    expect(stateLogs.length).toBeGreaterThan(0);
  });

  test('should maintain consistent animation behavior across multiple switches', async ({ page }) => {
    // Open filter first
    const filterButton = page.locator('button').filter({ hasText: /filter/i }).first();
    await filterButton.click();
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    // Switch to add user
    const addUserButton = page.locator('button:has-text("Tambah Pengguna")');
    await addUserButton.click();
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
    
    // Switch back to filter
    await filterButton.click();
    await expect(page.locator('text=Filter Lanjutan')).toBeVisible();
    
    // Switch to add user again
    await addUserButton.click();
    await expect(page.locator('text=Tambah Pengguna Baru')).toBeVisible();
    
    // Get all logs
    const logs = await page.evaluate(() => (window as any).consoleLogs || []);
    
    // Should have multiple toggle logs
    const filterToggleLogs = logs.filter(log => log.includes('ToggleFilterCard'));
    const addUserToggleLogs = logs.filter(log => log.includes('ToggleAddUserCard'));
    
    expect(filterToggleLogs.length).toBeGreaterThan(1);
    expect(addUserToggleLogs.length).toBeGreaterThan(1);
    
    // Should have consistent switching logs
    const switchingLogs = logs.filter(log => log.includes('No slide animation (switching)'));
    expect(switchingLogs.length).toBeGreaterThan(1);
  });
});
