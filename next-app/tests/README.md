# 🧪 Playwright Testing Guide

Guide lengkap untuk menjalankan test Playwright pada aplikasi Sistem Akademik.

## 📋 **Overview**

Test suite ini mencakup testing komprehensif untuk:
- **Rombel Modal Component**: CRUD operations, validation, error handling
- **Form Validation**: Real-time validation, error states, success states
- **Error Handling**: API errors, state recovery, auto-cleanup
- **User Experience**: Loading states, visual feedback, accessibility
- **Mobile Responsiveness**: Touch targets, viewport testing

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
# Install Playwright
npm run test:install

# Install project dependencies
npm install
```

### **2. Run Tests**
```bash
# Run all tests
npm run test

# Run specific test file
npm run test:rombel

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug
```

### **3. View Test Results**
```bash
# Show HTML report
npm run test:report

# Generate code for new tests
npm run test:codegen
```

## 🏗️ **Test Structure**

```
tests/
├── rombel-modal.spec.ts      # Main test suite
├── global-setup.ts           # Global setup
├── global-teardown.ts        # Global cleanup
├── utils/
│   └── test-helpers.ts      # Test utilities
└── README.md                 # This file
```

## 🧪 **Test Categories**

### **1. Basic Functionality**
- Modal opening/closing
- Form field display
- Required field indicators
- Button states

### **2. Form Validation**
- Submit button disable/enable
- Field validation errors
- Form completion progress
- Real-time validation

### **3. CRUD Operations**
- Create rombel
- Edit rombel
- Delete rombel
- API success/error handling

### **4. Error Handling & Recovery**
- API error scenarios
- State cleanup
- Auto-recovery
- Concurrent operations

### **5. Status Bar & Visual Feedback**
- Loading states
- Action tracking
- Deleted rombel count
- Last action display

### **6. Form State Management**
- Form reset
- Validation state changes
- Success/error states
- State persistence

### **7. Accessibility & UX**
- Keyboard navigation
- ARIA labels
- Touch targets
- Mobile responsiveness

## 🔧 **Test Configuration**

### **Playwright Config**
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
})
```

### **Environment Variables**
```bash
# Test environment
NODE_ENV=test
PLAYWRIGHT_TEST=true

# Base URL for testing
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

## 🎯 **Test Scenarios**

### **1. Happy Path Testing**
```
✅ Create rombel → Success
✅ Edit rombel → Success  
✅ Delete rombel → Success
✅ Form validation → Complete
```

### **2. Error Path Testing**
```
❌ API errors → Error handling
❌ Validation errors → User feedback
❌ Concurrent operations → State sync
❌ Network failures → Recovery
```

### **3. Edge Case Testing**
```
🔍 Race conditions → Prevention
🔍 State inconsistencies → Cleanup
🔍 Invalid inputs → Validation
🔍 Permission issues → Access control
```

## 🛠️ **Test Utilities**

### **TestHelpers Class**
```typescript
import { createTestHelpers } from './utils/test-helpers'

const helpers = createTestHelpers(page)

// Mock authentication
await helpers.mockAuth('SUPER_ADMIN')

// Mock API response
await helpers.mockApiResponse('/api/trpc/rombel.create*', response)

// Fill form
await helpers.fillForm({
  '[data-testid="rombel-name-select"]': 'A',
  '[data-testid="max-students-input"]': '30'
})
```

### **Common Test Data**
```typescript
import { testData } from './utils/test-helpers'

const rombel = testData.rombel
const user = testData.user.superAdmin
const apiErrors = testData.api.errors
```

### **Selector Constants**
```typescript
import { selectors } from './utils/test-helpers'

const modal = selectors.modal.container
const submitButton = selectors.form.submitButton
const editButton = selectors.table.editButton.replace('{id}', 'rombel-id')
```

## 📱 **Mobile Testing**

### **Viewport Testing**
```typescript
// Test mobile viewport
await page.setViewportSize({ width: 375, height: 667 })

// Check touch targets
const buttonSize = await submitButton.boundingBox()
expect(buttonSize?.width).toBeGreaterThan(44)
expect(buttonSize?.height).toBeGreaterThan(44)
```

### **Touch Interaction**
```typescript
// Simulate touch events
await page.touchscreen.tap(100, 100)

// Check mobile-specific behavior
await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
```

## 🔍 **Debugging Tests**

### **Debug Mode**
```bash
# Run specific test in debug mode
npm run test:rombel:debug

# Run with UI for step-by-step debugging
npm run test:ui
```

### **Screenshots & Videos**
```typescript
// Take screenshot on failure
await helpers.takeScreenshot('test-failure')

// Check test artifacts in test-results/
```

### **Console Logging**
```typescript
// Add console logs for debugging
console.log('Current form state:', await page.locator('form').textContent())

// Check browser console
const logs = await page.evaluate(() => console.logs)
```

## 📊 **Test Reporting**

### **HTML Report**
```bash
npm run test:report
# Opens HTML report in browser
```

### **JUnit Report**
```bash
# Generate JUnit XML for CI/CD
npm run test
# Results in test-results/results.xml
```

### **JSON Report**
```bash
# Generate JSON report
npm run test
# Results in test-results/results.json
```

## 🚀 **CI/CD Integration**

### **GitHub Actions**
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test:install
      - run: npm run test
      - uses: actions/upload-artifact@v2
        with:
          name: playwright-report
          path: test-results/
```

### **Docker Integration**
```dockerfile
# Dockerfile for testing
FROM mcr.microsoft.com/playwright:v1.40.0
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run test:install
CMD ["npm", "run", "test"]
```

## 🧹 **Test Maintenance**

### **Updating Tests**
```bash
# Update test snapshots
npm run test -- --update-snapshots

# Regenerate test code
npm run test:codegen
```

### **Test Data Management**
```typescript
// Keep test data in sync with schema changes
export const testData = {
  rombel: {
    // Update when schema changes
    name: 'A',
    maxStudents: '30'
  }
}
```

### **Selector Updates**
```typescript
// Update selectors when UI changes
export const selectors = {
  form: {
    // Keep selectors current
    submitButton: '[data-testid="submit-button"]'
  }
}
```

## 📚 **Best Practices**

### **1. Test Organization**
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests independent
- Clean up after each test

### **2. Test Data Management**
- Use consistent test data
- Mock external dependencies
- Avoid hardcoded values
- Centralize test data

### **3. Error Handling**
- Test both success and failure paths
- Verify error messages
- Check error recovery
- Test edge cases

### **4. Performance Testing**
- Test loading states
- Verify timeouts
- Check memory usage
- Monitor test execution time

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. Tests Failing Intermittently**
```bash
# Increase timeout
export default defineConfig({
  timeout: 60000,
  expect: { timeout: 20000 }
})
```

#### **2. Selector Not Found**
```typescript
// Use more specific selectors
await page.locator('[data-testid="specific-element"]').click()

// Wait for element to be visible
await page.waitForSelector('[data-testid="element"]', { state: 'visible' })
```

#### **3. API Mocking Issues**
```typescript
// Verify mock route pattern
await page.route('/api/trpc/rombel.create*', async route => {
  console.log('Mock route hit:', route.request().url())
  // ... mock response
})
```

### **Debug Commands**
```bash
# Run with verbose logging
DEBUG=pw:api npm run test

# Run specific test with retry
npm run test -- --grep "should create rombel" --retries 3

# Generate trace for debugging
npm run test -- --trace on
```

## 📈 **Performance Metrics**

### **Test Execution Time**
```bash
# Check test performance
npm run test -- --reporter=json | jq '.stats.duration'
```

### **Resource Usage**
```typescript
// Monitor memory usage
const memoryInfo = await page.evaluate(() => performance.memory)
console.log('Memory usage:', memoryInfo)
```

## 🔄 **Continuous Improvement**

### **Test Coverage**
- Add tests for new features
- Cover error scenarios
- Test accessibility features
- Validate mobile experience

### **Test Quality**
- Review test reliability
- Optimize test execution time
- Improve test maintainability
- Enhance debugging capabilities

---

**Happy Testing! 🧪✨**

Untuk pertanyaan atau bantuan, silakan buat issue di repository ini.
