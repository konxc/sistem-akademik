import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use

  // Launch browser and create new context
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Navigate to the application
    await page.goto(baseURL!)
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    console.log('✅ Global setup completed successfully')
    console.log(`🌐 Application is running at: ${baseURL}`)
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup
