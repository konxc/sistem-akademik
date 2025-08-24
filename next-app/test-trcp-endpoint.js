// Simple test to verify tRPC endpoint is working
const testTRPCEndpoint = async () => {
  try {
    console.log('Testing tRPC endpoint...')
    
    const response = await fetch('http://localhost:3000/api/trpc/rombel.getByClass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: {
          classId: 'test-class-id'
        }
      })
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const text = await response.text()
    console.log('Response body (first 200 chars):', text.substring(0, 200))
    
    if (response.ok) {
      try {
        const json = JSON.parse(text)
        console.log('✅ JSON parsed successfully:', json)
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError.message)
        console.log('Response is not valid JSON')
      }
    } else {
      console.error('❌ Request failed with status:', response.status)
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message)
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testTRPCEndpoint()
}
