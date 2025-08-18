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
  
  // Get token from cookies
  const token = request.cookies.get('next-auth.session-token')?.value ||
                request.cookies.get('__Secure-next-auth.session-token')?.value
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/signin', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If accessing login page with valid token, redirect to dashboard
  if (pathname === '/auth/signin' && token) {
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