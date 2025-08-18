import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { 
  Permission, 
  UserPermissions, 
  getPermissionsForRole, 
  hasPermission, 
  hasAllPermissions, 
  hasAnyPermission,
  UserRole 
} from '@/lib/permissions'

export function usePermissions() {
  const { data: session, status } = useSession()

  const userPermissions = useMemo(() => {
    if (!session?.user?.role) {
      return getPermissionsForRole(UserRole.USER)
    }
    
    // Get permissions based on user role
    return getPermissionsForRole(session.user.role as UserRole)
  }, [session?.user?.role])

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'

  // Permission checking functions
  const can = {
    // Single permission check
    do: (permission: Permission): boolean => {
      if (!isAuthenticated) return false
      return hasPermission(userPermissions, permission)
    },

    // Multiple permissions check (ALL)
    doAll: (permissions: Permission[]): boolean => {
      if (!isAuthenticated) return false
      return hasAllPermissions(userPermissions, permissions)
    },

    // Multiple permissions check (ANY)
    doAny: (permissions: Permission[]): boolean => {
      if (!isAuthenticated) return false
      return hasAnyPermission(userPermissions, permissions)
    },

    // Role-based check
    hasRole: (allowedRoles: string[]): boolean => {
      if (!isAuthenticated) return false
      return allowedRoles.includes(session?.user?.role || '')
    },

    // Admin check
    isAdmin: (): boolean => {
      if (!isAuthenticated) return false
      return ['ADMIN', 'SUPER_ADMIN'].includes(session?.user?.role || '')
    },

    // Super Admin check
    isSuperAdmin: (): boolean => {
      if (!isAuthenticated) return false
      return session?.user?.role === 'SUPER_ADMIN'
    }
  }

  // Feature access checks
  const canAccess = {
    // Dashboard Features
    dashboardOverview: can.do(Permission.CAN_VIEW_DASHBOARD_STATS),
    dashboardAnalytics: can.do(Permission.CAN_VIEW_ANALYTICS),
    
    // School Management
    schoolManagement: can.do(Permission.CAN_VIEW_SCHOOL),
    schoolEdit: can.do(Permission.CAN_EDIT_SCHOOL),
    schoolDelete: can.do(Permission.CAN_MANAGE_SCHOOL),
    
    // User Management
    userManagement: can.do(Permission.CAN_VIEW_USERS),
    userCreate: can.do(Permission.CAN_CREATE_USERS),
    userEdit: can.do(Permission.CAN_EDIT_USERS),
    userDelete: can.do(Permission.CAN_DELETE_USERS),
    userManageRoles: can.do(Permission.CAN_MANAGE_ROLES),
    userManageAdmins: can.do(Permission.CAN_MANAGE_ADMINS),
    
    // Class Management
    classManagement: can.do(Permission.CAN_VIEW_CLASSES),
    classCreate: can.do(Permission.CAN_CREATE_CLASSES),
    classEdit: can.do(Permission.CAN_EDIT_CLASSES),
    classDelete: can.do(Permission.CAN_DELETE_CLASSES),
    classAssignTeachers: can.do(Permission.CAN_ASSIGN_TEACHERS),
    classManageSchedule: can.do(Permission.CAN_MANAGE_CLASS_SCHEDULE),
    
    // Subject Management
    subjectManagement: can.do(Permission.CAN_VIEW_SUBJECTS),
    subjectCreate: can.do(Permission.CAN_CREATE_SUBJECTS),
    subjectEdit: can.do(Permission.CAN_EDIT_SUBJECTS),
    subjectDelete: can.do(Permission.CAN_DELETE_SUBJECTS),
    subjectAssign: can.do(Permission.CAN_ASSIGN_SUBJECTS),
    
    // Attendance System
    attendanceView: can.do(Permission.CAN_VIEW_ATTENDANCE),
    attendanceMark: can.do(Permission.CAN_MARK_ATTENDANCE),
    attendanceEdit: can.do(Permission.CAN_EDIT_ATTENDANCE),
    attendanceReports: can.do(Permission.CAN_VIEW_ATTENDANCE_REPORTS),
    attendanceRules: can.do(Permission.CAN_MANAGE_ATTENDANCE_RULES),
    
    // Financial Management
    financialView: can.do(Permission.CAN_VIEW_FINANCES),
    studentWallet: can.do(Permission.CAN_MANAGE_STUDENT_WALLET),
    classFunds: can.do(Permission.CAN_MANAGE_CLASS_FUNDS),
    financialReports: can.do(Permission.CAN_VIEW_FINANCIAL_REPORTS),
    approveExpenses: can.do(Permission.CAN_APPROVE_EXPENSES),
    manageBudgets: can.do(Permission.CAN_MANAGE_BUDGETS),
    
    // Asset Management
    assetView: can.do(Permission.CAN_VIEW_ASSETS),
    assetCreate: can.do(Permission.CAN_CREATE_ASSETS),
    assetEdit: can.do(Permission.CAN_EDIT_ASSETS),
    assetDelete: can.do(Permission.CAN_DELETE_ASSETS),
    assetAssign: can.do(Permission.CAN_ASSIGN_ASSETS),
    assetTrack: can.do(Permission.CAN_TRACK_ASSETS),
    
    // Scheduling
    scheduleView: can.do(Permission.CAN_VIEW_SCHEDULES),
    scheduleCreate: can.do(Permission.CAN_CREATE_SCHEDULES),
    scheduleEdit: can.do(Permission.CAN_EDIT_SCHEDULES),
    scheduleDelete: can.do(Permission.CAN_DELETE_SCHEDULES),
    dutySchedule: can.do(Permission.CAN_MANAGE_DUTY_SCHEDULE),
    googleCalendar: can.do(Permission.CAN_INTEGRATE_GOOGLE_CALENDAR),
    
    // Reports & Analytics
    reportsView: can.do(Permission.CAN_VIEW_REPORTS),
    reportsGenerate: can.do(Permission.CAN_GENERATE_REPORTS),
    reportsExport: can.do(Permission.CAN_EXPORT_REPORTS),
    analyticsView: can.do(Permission.CAN_VIEW_ANALYTICS),
    
    // System Settings
    settingsView: can.do(Permission.CAN_VIEW_SETTINGS),
    settingsEdit: can.do(Permission.CAN_EDIT_SETTINGS),
    systemManage: can.do(Permission.CAN_MANAGE_SYSTEM),
    logsView: can.do(Permission.CAN_VIEW_LOGS),
    backupsManage: can.do(Permission.CAN_MANAGE_BACKUPS),
    ldapManage: can.do(Permission.CAN_MANAGE_LDAP),
    
    // Network & Monitoring
    networkView: can.do(Permission.CAN_VIEW_NETWORK_STATUS),
    networkManage: can.do(Permission.CAN_MANAGE_NETWORK),
    monitoringView: can.do(Permission.CAN_VIEW_SYSTEM_MONITORING),
    monitoringManage: can.do(Permission.CAN_MANAGE_SYSTEM_MONITORING),
    
    // Helpdesk & Support
    helpdeskView: can.do(Permission.CAN_VIEW_HELPDESK),
    ticketsCreate: can.do(Permission.CAN_CREATE_TICKETS),
    ticketsEdit: can.do(Permission.CAN_EDIT_TICKETS),
    ticketsResolve: can.do(Permission.CAN_RESOLVE_TICKETS),
    helpdeskManage: can.do(Permission.CAN_MANAGE_HELPDESK),
    
    // Mobile Features
    mobileAccess: can.do(Permission.CAN_ACCESS_MOBILE),
    mobileFeatures: can.do(Permission.CAN_USE_MOBILE_FEATURES),
    mobileDashboard: can.do(Permission.CAN_VIEW_MOBILE_DASHBOARD),
    
    // Student Specific
    ownGrades: can.do(Permission.CAN_VIEW_OWN_GRADES),
    ownAttendance: can.do(Permission.CAN_VIEW_OWN_ATTENDANCE),
    ownSchedule: can.do(Permission.CAN_VIEW_OWN_SCHEDULE),
    ownWallet: can.do(Permission.CAN_VIEW_OWN_WALLET),
    
    // Teacher Specific
    classGrades: can.do(Permission.CAN_VIEW_CLASS_GRADES),
    editClassGrades: can.do(Permission.CAN_EDIT_CLASS_GRADES),
    classAttendance: can.do(Permission.CAN_VIEW_CLASS_ATTENDANCE),
    classContent: can.do(Permission.CAN_MANAGE_CLASS_CONTENT),
    
    // Parent Specific
    childGrades: can.do(Permission.CAN_VIEW_CHILD_GRADES),
    childAttendance: can.do(Permission.CAN_VIEW_CHILD_ATTENDANCE),
    childSchedule: can.do(Permission.CAN_VIEW_CHILD_SCHEDULE),
    childWallet: can.do(Permission.CAN_VIEW_CHILD_WALLET)
  }

  return {
    // State
    isLoading,
    isAuthenticated,
    userRole: session?.user?.role || 'USER',
    userPermissions,
    
    // Permission checking
    can,
    
    // Feature access
    canAccess,
    
    // Helper functions
    hasPermission: can.do,
    hasAllPermissions: can.doAll,
    hasAnyPermission: can.doAny,
    hasRole: can.hasRole,
    isAdmin: can.isAdmin,
    isSuperAdmin: can.isSuperAdmin
  }
}

// Hook untuk conditional rendering berdasarkan permissions
export function usePermissionGuard(permission: Permission) {
  const { can } = usePermissions()
  return can.do(permission)
}

export function usePermissionGuardAll(permissions: Permission[]) {
  const { can } = usePermissions()
  return can.doAll(permissions)
}

export function usePermissionGuardAny(permissions: Permission[]) {
  const { can } = usePermissions()
  return can.doAny(permissions)
}

export function useRoleGuard(allowedRoles: string[]) {
  const { can } = usePermissions()
  return can.hasRole(allowedRoles)
}

export function useAdminGuard() {
  const { can } = usePermissions()
  return can.isAdmin()
}

export function useSuperAdminGuard() {
  const { can } = usePermissions()
  return can.isSuperAdmin()
}
