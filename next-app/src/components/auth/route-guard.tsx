'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
  requiredRole?: string
  requiredPermissions?: string[]
  fallback?: React.ReactNode
}

export function RouteGuard({ 
  children, 
  requiredRole, 
  requiredPermissions, 
  fallback 
}: RouteGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Jika masih loading, tunggu
    if (status === 'loading') return

    // Jika tidak ada session, redirect ke login
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    // Jika ada session tapi tidak ada user data
    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    // Check role requirement (SUPER_ADMIN can access everything)
    if (requiredRole && session.user.role !== requiredRole && session.user.role !== 'SUPER_ADMIN') {
      router.push('/auth/error?error=insufficient_permissions')
      return
    }

    // Check permissions requirement
    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = (session.user as any).permissions || []
      const hasAllPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      )
      
      if (!hasAllPermissions) {
        router.push('/auth/error?error=insufficient_permissions')
        return
      }
    }
  }, [session, status, router, pathname, requiredRole, requiredPermissions])

  // Loading state
  if (status === 'loading') {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Unauthenticated state
  if (status === 'unauthenticated') {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check role requirement (SUPER_ADMIN can access everything)
  if (requiredRole && session?.user?.role !== requiredRole && session?.user?.role !== 'SUPER_ADMIN') {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Insufficient permissions...</p>
        </div>
      </div>
    )
  }

  // Check permissions requirement
  if (requiredPermissions && requiredPermissions.length > 0) {
    const userPermissions = (session?.user as any)?.permissions || []
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    )
    
    if (!hasAllPermissions) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Insufficient permissions...</p>
          </div>
        </div>
      )
    }
  }

  // Authorized - render children
  return <>{children}</>
}

// Convenience components for common use cases
export function AdminRouteGuard({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  return (
    <RouteGuard 
      requiredRole="ADMIN" 
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  )
}

export function SuperAdminRouteGuard({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  return (
    <RouteGuard 
      requiredRole="SUPER_ADMIN" 
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  )
}

export function PermissionRouteGuard({ 
  children, 
  permissions, 
  fallback 
}: { 
  children: React.ReactNode, 
  permissions: string[], 
  fallback?: React.ReactNode 
}) {
  return (
    <RouteGuard 
      requiredPermissions={permissions} 
      fallback={fallback}
    >
      {children}
    </RouteGuard>
  )
}
