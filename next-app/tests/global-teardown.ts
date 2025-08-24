import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  try {
    console.log('🧹 Global teardown started')
    
    // Clean up any test artifacts
    // This could include:
    // - Cleaning up test databases
    // - Removing test files
    // - Resetting application state
    
    console.log('✅ Global teardown completed successfully')
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown
