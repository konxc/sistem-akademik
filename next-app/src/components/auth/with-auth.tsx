'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ComponentType } from 'react'
import { Loader2 } from 'lucide-react'

interface WithAuthOptions {
  requiredRole?: string
  requiredPermissions?: string[]
  redirectTo?: string
  loadingComponent?: React.ComponentType
  unauthorizedComponent?: React.ComponentType
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requiredRole,
    requiredPermissions,
    redirectTo = '/auth/signin',
    loadingComponent: LoadingComponent,
    unauthorizedComponent: UnauthorizedComponent
  } = options

  function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      // Jika masih loading, tunggu
      if (status === 'loading') return

      // Jika tidak ada session, redirect ke login
      if (status === 'unauthenticated') {
        router.push(redirectTo)
        return
      }

      // Jika ada session tapi tidak ada user data
      if (!session?.user) {
        router.push(redirectTo)
        return
      }

      // Check role requirement (SUPER_ADMIN can access everything)
      if (requiredRole && session.user.role !== requiredRole && session.user.role !== 'SUPER_ADMIN') {
        router.push('/auth/error?error=role_required&requiredRole=' + requiredRole)
        return
      }

      // Check permissions requirement
      if (requiredPermissions && requiredPermissions.length > 0) {
        const userPermissions = (session.user as any).permissions || []
        const hasAllPermissions = requiredPermissions.every(permission => 
          userPermissions.includes(permission)
        )
        
        if (!hasAllPermissions) {
          router.push('/auth/error?error=permissions_required&requiredPermissions=' + requiredPermissions.join(','))
          return
        }
      }
    }, [session, status, router, redirectTo, requiredRole, requiredPermissions])

    // Loading state
    if (status === 'loading') {
      return LoadingComponent ? <LoadingComponent /> : (
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
      return UnauthorizedComponent ? <UnauthorizedComponent /> : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        </div>
      )
    }

    // Check role requirement (SUPER_ADMIN can access everything)
    if (requiredRole && session?.user?.role !== requiredRole && session?.user?.role !== 'SUPER_ADMIN') {
      return UnauthorizedComponent ? <UnauthorizedComponent /> : (
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
        return UnauthorizedComponent ? <UnauthorizedComponent /> : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-muted-foreground">Insufficient permissions...</p>
            </div>
          </div>
        )
      }
    }

    // Authorized - render wrapped component
    return <WrappedComponent {...props} />
  }

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`

  return AuthenticatedComponent
}

// Convenience HOCs for common use cases
export function withAdminAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: Omit<WithAuthOptions, 'requiredRole'> = {}
) {
  return withAuth(WrappedComponent, { ...options, requiredRole: 'ADMIN' })
}

export function withSuperAdminAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: Omit<WithAuthOptions, 'requiredRole'> = {}
) {
  return withAuth(WrappedComponent, { ...options, requiredRole: 'SUPER_ADMIN' })
}

export function withPermissionAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  permissions: string[],
  options: Omit<WithAuthOptions, 'requiredPermissions'> = {}
) {
  return withAuth(WrappedComponent, { ...options, requiredPermissions: permissions })
}
