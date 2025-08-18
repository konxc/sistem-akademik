import React from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { Permission } from '@/lib/permissions'

interface PermissionGuardProps {
  permission: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

interface RoleGuardProps {
  allowedRoles: string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

interface AdminGuardProps {
  fallback?: React.ReactNode
  children: React.ReactNode
}

interface SuperAdminGuardProps {
  fallback?: React.ReactNode
  children: React.ReactNode
}

// Single permission guard
export function PermissionGuard({ 
  permission, 
  fallback = null, 
  children 
}: PermissionGuardProps) {
  const { can } = usePermissions()
  
  if (!can.do(permission)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Multiple permissions guard (ALL)
export function PermissionGuardAll({ 
  permissions = [], 
  fallback = null, 
  children 
}: PermissionGuardProps) {
  const { can } = usePermissions()
  
  if (!can.doAll(permissions)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Multiple permissions guard (ANY)
export function PermissionGuardAny({ 
  permissions = [], 
  fallback = null, 
  children 
}: PermissionGuardProps) {
  const { can } = usePermissions()
  
  if (!can.doAny(permissions)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Role-based guard
export function RoleGuard({ 
  allowedRoles, 
  fallback = null, 
  children 
}: RoleGuardProps) {
  const { can } = usePermissions()
  
  if (!can.hasRole(allowedRoles)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Admin guard
export function AdminGuard({ 
  fallback = null, 
  children 
}: AdminGuardProps) {
  const { can } = usePermissions()
  
  if (!can.isAdmin()) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Super Admin guard
export function SuperAdminGuard({ 
  fallback = null, 
  children 
}: SuperAdminGuardProps) {
  const { can } = usePermissions()
  
  if (!can.isSuperAdmin()) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Flexible permission guard component
export function Guard({ 
  permission,
  permissions,
  requireAll = false,
  allowedRoles,
  isAdmin = false,
  isSuperAdmin = false,
  fallback = null,
  children 
}: {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  allowedRoles?: string[]
  isAdmin?: boolean
  isSuperAdmin?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}) {
  const { can } = usePermissions()
  
  // Check permissions
  if (permission && !can.do(permission)) {
    return <>{fallback}</>
  }
  
  if (permissions && requireAll && !can.doAll(permissions)) {
    return <>{fallback}</>
  }
  
  if (permissions && !requireAll && !can.doAny(permissions)) {
    return <>{fallback}</>
  }
  
  // Check roles
  if (allowedRoles && !can.hasRole(allowedRoles)) {
    return <>{fallback}</>
  }
  
  if (isAdmin && !can.isAdmin()) {
    return <>{fallback}</>
  }
  
  if (isSuperAdmin && !can.isSuperAdmin()) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Higher-order component untuk permission-based rendering
export function withPermission<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  permission: Permission,
  fallback?: React.ReactNode
) {
  return function PermissionWrappedComponent(props: T) {
    return (
      <PermissionGuard permission={permission} fallback={fallback}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    )
  }
}

export function withRole<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  allowedRoles: string[],
  fallback?: React.ReactNode
) {
  return function RoleWrappedComponent(props: T) {
    return (
      <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
        <WrappedComponent {...props} />
      </RoleGuard>
    )
  }
}

export function withAdmin<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function AdminWrappedComponent(props: T) {
    return (
      <AdminGuard fallback={fallback}>
        <WrappedComponent {...props} />
      </AdminGuard>
    )
  }
}

export function withSuperAdmin<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function SuperAdminWrappedComponent(props: T) {
    return (
      <SuperAdminGuard fallback={fallback}>
        <WrappedComponent {...props} />
      </SuperAdminGuard>
    )
  }
}
