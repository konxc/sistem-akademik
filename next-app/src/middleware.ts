import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes yang perlu diproteksi
const protectedRoutes = [
  '/dashboard',
  '/dashboard/school-management',
  '/dashboard/users',
  '/dashboard/students',
  '/dashboard/teachers',
  '/dashboard/staff',
  '/dashboard/subjects',
  '/dashboard/classes',
  '/dashboard/departments',
  '/dashboard/majors',
  '/dashboard/academic-years'
]

// Routes yang tidak perlu diproteksi (public)
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/error',
  '/api/auth',
  '/api/trpc'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Get token from cookies - check both development and production cookie names
  const token = request.cookies.get('next-auth.session-token')?.value ||
                request.cookies.get('__Secure-next-auth.session-token')?.value ||
                request.cookies.get('__Host-next-auth.csrf-token')?.value
  
  // If accessing protected route without token, redirect to login with proper callback
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/signin', request.url)
    // Encode the full pathname as callback URL
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname))
    return NextResponse.redirect(loginUrl)
  }
  
  // If accessing login page with valid token, redirect to dashboard or callback URL
  if (pathname === '/auth/signin' && token) {
    // Check if there's a callback URL in the query params
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
    if (callbackUrl && callbackUrl.startsWith('/')) {
      // Decode the callback URL and redirect
      try {
        const decodedCallback = decodeURIComponent(callbackUrl)
        if (decodedCallback.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL(decodedCallback, request.url))
        }
      } catch (error) {
        console.error('Error decoding callback URL:', error)
      }
    }
    // Default redirect to dashboard
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  // If accessing signup page with valid token, redirect to dashboard
  if (pathname === '/auth/signup' && token) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}