import { TRPCError } from '@trpc/server'
import { Permission, hasPermission, hasAllPermissions, getPermissionsForRole } from '@/lib/permissions'
import type { UserPermissions } from '@/lib/permissions'

// Helper functions untuk permission checking
export function checkPermission(userPermissions: UserPermissions, permission: Permission): boolean {
  return hasPermission(userPermissions, permission)
}

export function checkAllPermissions(userPermissions: UserPermissions, permissions: Permission[]): boolean {
  return hasAllPermissions(userPermissions, permissions)
}

export function checkAnyPermission(userPermissions: UserPermissions, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userPermissions, permission))
}

// Helper untuk mendapatkan permissions berdasarkan role
export function getPermissionsByRole(role: string): UserPermissions {
  return getPermissionsForRole(role as any)
}

// Permission validation functions
export function validatePermission(
  userRole: string, 
  userPermissions: UserPermissions, 
  requiredPermission: Permission
): void {
  if (!hasPermission(userPermissions, requiredPermission)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Role ${userRole} tidak memiliki permission: ${requiredPermission}`,
    })
  }
}

export function validateAllPermissions(
  userRole: string,
  userPermissions: UserPermissions,
  requiredPermissions: Permission[]
): void {
  if (!hasAllPermissions(userPermissions, requiredPermissions)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Role ${userRole} tidak memiliki semua permission yang diperlukan: ${requiredPermissions.join(', ')}`,
    })
  }
}

export function validateAnyPermission(
  userRole: string,
  userPermissions: UserPermissions,
  requiredPermissions: Permission[]
): void {
  if (!checkAnyPermission(userPermissions, requiredPermissions)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Role ${userRole} tidak memiliki permission yang diperlukan. Diperlukan salah satu dari: ${requiredPermissions.join(', ')}`,
    })
  }
}

// Role validation functions
export function validateRole(userRole: string, allowedRoles: string[]): void {
  if (!allowedRoles.includes(userRole)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Role Anda (${userRole}) tidak memiliki akses ke fitur ini. Diperlukan role: ${allowedRoles.join(', ')}`,
    })
  }
}

export function validateAdminRole(userRole: string): void {
  validateRole(userRole, ['ADMIN', 'SUPER_ADMIN'])
}

export function validateSuperAdminRole(userRole: string): void {
  validateRole(userRole, ['SUPER_ADMIN'])
}

// Permission decorators untuk use dalam tRPC procedures
export const permissionGuards = {
  // Single permission guard
  requirePermission: (permission: Permission) => ({
    validate: (userRole: string, userPermissions: UserPermissions) => 
      validatePermission(userRole, userPermissions, permission)
  }),

  // Multiple permissions guard (ALL)
  requireAllPermissions: (permissions: Permission[]) => ({
    validate: (userRole: string, userPermissions: UserPermissions) => 
      validateAllPermissions(userRole, userPermissions, permissions)
  }),

  // Multiple permissions guard (ANY)
  requireAnyPermission: (permissions: Permission[]) => ({
    validate: (userRole: string, userPermissions: UserPermissions) => 
      validateAnyPermission(userRole, userPermissions, permissions)
  }),

  // Role-based guard
  requireRole: (allowedRoles: string[]) => ({
    validate: (userRole: string) => validateRole(userRole, allowedRoles)
  }),

  // Admin guard
  requireAdmin: {
    validate: (userRole: string) => validateAdminRole(userRole)
  },

  // Super Admin guard
  requireSuperAdmin: {
    validate: (userRole: string) => validateSuperAdminRole(userRole)
  }
}

// Export types
export type PermissionContext = {
  user: {
    id: string
    name?: string | null
    email?: string | null
    role: string
  }
  permissions: UserPermissions
}
