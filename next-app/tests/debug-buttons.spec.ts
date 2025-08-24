import { test, expect } from '@playwright/test';
import { loginAsAdmin, navigateToUsersPage } from './utils/auth-helper';

test('Debug: Check what buttons actually exist on users page', async ({ page }) => {
  // Login as admin first
  await loginAsAdmin(page);
  
  // Navigate to users page
  await navigateToUsersPage(page);
  
  // Wait a bit for page to fully load
  await page.waitForTimeout(2000);
  
  // Get all buttons on the page
  const allButtons = await page.locator('button').all();
  
  console.log(`Found ${allButtons.length} buttons on the page`);
  
  // Log text content of each button
  for (let i = 0; i < allButtons.length; i++) {
    const buttonText = await allButtons[i].textContent();
    const buttonClasses = await allButtons[i].getAttribute('class');
    console.log(`Button ${i + 1}: "${buttonText}" - Classes: ${buttonClasses}`);
  }
  
  // Also check for any elements containing "Filter" text
  const filterElements = await page.locator('*:has-text("Filter")').all();
  console.log(`Found ${filterElements.length} elements containing "Filter" text`);
  
  for (let i = 0; i < filterElements.length; i++) {
    const elementText = await filterElements[i].textContent();
    const tagName = await filterElements[i].evaluate(el => el.tagName);
    console.log(`Filter Element ${i + 1}: <${tagName}> "${elementText}"`);
  }
  
  // Check for "Tambah Pengguna" elements
  const addUserElements = await page.locator('*:has-text("Tambah Pengguna")').all();
  console.log(`Found ${addUserElements.length} elements containing "Tambah Pengguna" text`);
  
  for (let i = 0; i < addUserElements.length; i++) {
    const elementText = await addUserElements[i].textContent();
    const tagName = await addUserElements[i].evaluate(el => el.tagName);
    console.log(`Add User Element ${i + 1}: <${tagName}> "${elementText}"`);
  }
  
  // Take a screenshot for visual inspection
  await page.screenshot({ path: 'debug-users-page.png', fullPage: true });
});
