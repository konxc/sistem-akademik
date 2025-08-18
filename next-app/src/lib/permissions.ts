// Permission-Based System untuk Dashboard SMA UII
// Sistem ini mengatur akses berdasarkan role dan permissions

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",    // Full system access
  ADMIN = "ADMIN",                // School-level admin
  MODERATOR = "MODERATOR",        // Limited admin
  TEACHER = "TEACHER",            // Teacher access
  STUDENT = "STUDENT",            // Student access
  STAFF = "STAFF",                // Staff access
  PARENT = "PARENT",              // Parent access
  USER = "USER"                   // Basic user
}

export enum Permission {
  // User Management
  CAN_VIEW_USERS = "can_view_users",
  CAN_CREATE_USERS = "can_create_users",
  CAN_EDIT_USERS = "can_edit_users",
  CAN_DELETE_USERS = "can_delete_users",
  CAN_MANAGE_ROLES = "can_manage_roles",
  CAN_MANAGE_ADMINS = "can_manage_admins",

  // School Management
  CAN_VIEW_SCHOOL = "can_view_school",
  CAN_EDIT_SCHOOL = "can_edit_school",
  CAN_MANAGE_SCHOOL = "can_manage_school",
  CAN_VIEW_DEPARTMENTS = "can_view_departments",
  CAN_EDIT_DEPARTMENTS = "can_edit_departments",
  CAN_MANAGE_DEPARTMENTS = "can_manage_departments",

  // Class Management
  CAN_VIEW_CLASSES = "can_view_classes",
  CAN_CREATE_CLASSES = "can_create_classes",
  CAN_EDIT_CLASSES = "can_edit_classes",
  CAN_DELETE_CLASSES = "can_delete_classes",
  CAN_ASSIGN_TEACHERS = "can_assign_teachers",
  CAN_MANAGE_CLASS_SCHEDULE = "can_manage_class_schedule",

  // Subject Management
  CAN_VIEW_SUBJECTS = "can_view_subjects",
  CAN_CREATE_SUBJECTS = "can_create_subjects",
  CAN_EDIT_SUBJECTS = "can_edit_subjects",
  CAN_DELETE_SUBJECTS = "can_delete_subjects",
  CAN_ASSIGN_SUBJECTS = "can_assign_subjects",

  // Attendance System
  CAN_VIEW_ATTENDANCE = "can_view_attendance",
  CAN_MARK_ATTENDANCE = "can_mark_attendance",
  CAN_EDIT_ATTENDANCE = "can_edit_attendance",
  CAN_VIEW_ATTENDANCE_REPORTS = "can_view_attendance_reports",
  CAN_MANAGE_ATTENDANCE_RULES = "can_manage_attendance_rules",

  // Financial Management
  CAN_VIEW_FINANCES = "can_view_finances",
  CAN_MANAGE_STUDENT_WALLET = "can_manage_student_wallet",
  CAN_MANAGE_CLASS_FUNDS = "can_manage_class_funds",
  CAN_VIEW_FINANCIAL_REPORTS = "can_view_financial_reports",
  CAN_APPROVE_EXPENSES = "can_approve_expenses",
  CAN_MANAGE_BUDGETS = "can_manage_budgets",

  // Asset Management
  CAN_VIEW_ASSETS = "can_view_assets",
  CAN_CREATE_ASSETS = "can_create_assets",
  CAN_EDIT_ASSETS = "can_edit_assets",
  CAN_DELETE_ASSETS = "can_delete_assets",
  CAN_ASSIGN_ASSETS = "can_assign_assets",
  CAN_TRACK_ASSETS = "can_track_assets",

  // Scheduling
  CAN_VIEW_SCHEDULES = "can_view_schedules",
  CAN_CREATE_SCHEDULES = "can_create_schedules",
  CAN_EDIT_SCHEDULES = "can_edit_schedules",
  CAN_DELETE_SCHEDULES = "can_delete_schedules",
  CAN_MANAGE_DUTY_SCHEDULE = "can_manage_duty_schedule",
  CAN_INTEGRATE_GOOGLE_CALENDAR = "can_integrate_google_calendar",

  // Reports & Analytics
  CAN_VIEW_REPORTS = "can_view_reports",
  CAN_GENERATE_REPORTS = "can_generate_reports",
  CAN_EXPORT_REPORTS = "can_export_reports",
  CAN_VIEW_ANALYTICS = "can_view_analytics",
  CAN_VIEW_DASHBOARD_STATS = "can_view_dashboard_stats",

  // System Settings
  CAN_VIEW_SETTINGS = "can_view_settings",
  CAN_EDIT_SETTINGS = "can_edit_settings",
  CAN_MANAGE_SYSTEM = "can_manage_system",
  CAN_VIEW_LOGS = "can_view_logs",
  CAN_MANAGE_BACKUPS = "can_manage_backups",
  CAN_MANAGE_LDAP = "can_manage_ldap",

  // Network & Monitoring
  CAN_VIEW_NETWORK_STATUS = "can_view_network_status",
  CAN_MANAGE_NETWORK = "can_manage_network",
  CAN_VIEW_SYSTEM_MONITORING = "can_view_system_monitoring",
  CAN_MANAGE_SYSTEM_MONITORING = "can_manage_system_monitoring",

  // Helpdesk & Support
  CAN_VIEW_HELPDESK = "can_view_helpdesk",
  CAN_CREATE_TICKETS = "can_create_tickets",
  CAN_EDIT_TICKETS = "can_edit_tickets",
  CAN_RESOLVE_TICKETS = "can_resolve_tickets",
  CAN_MANAGE_HELPDESK = "can_manage_helpdesk",

  // Mobile Features
  CAN_ACCESS_MOBILE = "can_access_mobile",
  CAN_USE_MOBILE_FEATURES = "can_use_mobile_features",
  CAN_VIEW_MOBILE_DASHBOARD = "can_view_mobile_dashboard",

  // Student Specific
  CAN_VIEW_OWN_GRADES = "can_view_own_grades",
  CAN_VIEW_OWN_ATTENDANCE = "can_view_own_attendance",
  CAN_VIEW_OWN_SCHEDULE = "can_view_own_schedule",
  CAN_VIEW_OWN_WALLET = "can_view_own_wallet",

  // Teacher Specific
  CAN_VIEW_CLASS_GRADES = "can_view_class_grades",
  CAN_EDIT_CLASS_GRADES = "can_edit_class_grades",
  CAN_VIEW_CLASS_ATTENDANCE = "can_view_class_attendance",
  CAN_MANAGE_CLASS_CONTENT = "can_manage_class_content",

  // Parent Specific
  CAN_VIEW_CHILD_GRADES = "can_view_child_grades",
  CAN_VIEW_CHILD_ATTENDANCE = "can_view_child_attendance",
  CAN_VIEW_CHILD_SCHEDULE = "can_view_child_schedule",
  CAN_VIEW_CHILD_WALLET = "can_view_child_wallet"
}

export interface UserPermissions {
  // User Management
  [Permission.CAN_VIEW_USERS]: boolean
  [Permission.CAN_CREATE_USERS]: boolean
  [Permission.CAN_EDIT_USERS]: boolean
  [Permission.CAN_DELETE_USERS]: boolean
  [Permission.CAN_MANAGE_ROLES]: boolean
  [Permission.CAN_MANAGE_ADMINS]: boolean

  // School Management
  [Permission.CAN_VIEW_SCHOOL]: boolean
  [Permission.CAN_EDIT_SCHOOL]: boolean
  [Permission.CAN_MANAGE_SCHOOL]: boolean
  [Permission.CAN_VIEW_DEPARTMENTS]: boolean
  [Permission.CAN_EDIT_DEPARTMENTS]: boolean
  [Permission.CAN_MANAGE_DEPARTMENTS]: boolean

  // Class Management
  [Permission.CAN_VIEW_CLASSES]: boolean
  [Permission.CAN_CREATE_CLASSES]: boolean
  [Permission.CAN_EDIT_CLASSES]: boolean
  [Permission.CAN_DELETE_CLASSES]: boolean
  [Permission.CAN_ASSIGN_TEACHERS]: boolean
  [Permission.CAN_MANAGE_CLASS_SCHEDULE]: boolean

  // Subject Management
  [Permission.CAN_VIEW_SUBJECTS]: boolean
  [Permission.CAN_CREATE_SUBJECTS]: boolean
  [Permission.CAN_EDIT_SUBJECTS]: boolean
  [Permission.CAN_DELETE_SUBJECTS]: boolean
  [Permission.CAN_ASSIGN_SUBJECTS]: boolean

  // Attendance System
  [Permission.CAN_VIEW_ATTENDANCE]: boolean
  [Permission.CAN_MARK_ATTENDANCE]: boolean
  [Permission.CAN_EDIT_ATTENDANCE]: boolean
  [Permission.CAN_VIEW_ATTENDANCE_REPORTS]: boolean
  [Permission.CAN_MANAGE_ATTENDANCE_RULES]: boolean

  // Financial Management
  [Permission.CAN_VIEW_FINANCES]: boolean
  [Permission.CAN_MANAGE_STUDENT_WALLET]: boolean
  [Permission.CAN_MANAGE_CLASS_FUNDS]: boolean
  [Permission.CAN_VIEW_FINANCIAL_REPORTS]: boolean
  [Permission.CAN_APPROVE_EXPENSES]: boolean
  [Permission.CAN_MANAGE_BUDGETS]: boolean

  // Asset Management
  [Permission.CAN_VIEW_ASSETS]: boolean
  [Permission.CAN_CREATE_ASSETS]: boolean
  [Permission.CAN_EDIT_ASSETS]: boolean
  [Permission.CAN_DELETE_ASSETS]: boolean
  [Permission.CAN_ASSIGN_ASSETS]: boolean
  [Permission.CAN_TRACK_ASSETS]: boolean

  // Scheduling
  [Permission.CAN_VIEW_SCHEDULES]: boolean
  [Permission.CAN_CREATE_SCHEDULES]: boolean
  [Permission.CAN_EDIT_SCHEDULES]: boolean
  [Permission.CAN_DELETE_SCHEDULES]: boolean
  [Permission.CAN_MANAGE_DUTY_SCHEDULE]: boolean
  [Permission.CAN_INTEGRATE_GOOGLE_CALENDAR]: boolean

  // Reports & Analytics
  [Permission.CAN_VIEW_REPORTS]: boolean
  [Permission.CAN_GENERATE_REPORTS]: boolean
  [Permission.CAN_EXPORT_REPORTS]: boolean
  [Permission.CAN_VIEW_ANALYTICS]: boolean
  [Permission.CAN_VIEW_DASHBOARD_STATS]: boolean

  // System Settings
  [Permission.CAN_VIEW_SETTINGS]: boolean
  [Permission.CAN_EDIT_SETTINGS]: boolean
  [Permission.CAN_MANAGE_SYSTEM]: boolean
  [Permission.CAN_VIEW_LOGS]: boolean
  [Permission.CAN_MANAGE_BACKUPS]: boolean
  [Permission.CAN_MANAGE_LDAP]: boolean

  // Network & Monitoring
  [Permission.CAN_VIEW_NETWORK_STATUS]: boolean
  [Permission.CAN_MANAGE_NETWORK]: boolean
  [Permission.CAN_VIEW_SYSTEM_MONITORING]: boolean
  [Permission.CAN_MANAGE_SYSTEM_MONITORING]: boolean

  // Helpdesk & Support
  [Permission.CAN_VIEW_HELPDESK]: boolean
  [Permission.CAN_CREATE_TICKETS]: boolean
  [Permission.CAN_EDIT_TICKETS]: boolean
  [Permission.CAN_RESOLVE_TICKETS]: boolean
  [Permission.CAN_MANAGE_HELPDESK]: boolean

  // Mobile Features
  [Permission.CAN_ACCESS_MOBILE]: boolean
  [Permission.CAN_USE_MOBILE_FEATURES]: boolean
  [Permission.CAN_VIEW_MOBILE_DASHBOARD]: boolean

  // Student Specific
  [Permission.CAN_VIEW_OWN_GRADES]: boolean
  [Permission.CAN_VIEW_OWN_ATTENDANCE]: boolean
  [Permission.CAN_VIEW_OWN_SCHEDULE]: boolean
  [Permission.CAN_VIEW_OWN_WALLET]: boolean

  // Teacher Specific
  [Permission.CAN_VIEW_CLASS_GRADES]: boolean
  [Permission.CAN_EDIT_CLASS_GRADES]: boolean
  [Permission.CAN_VIEW_CLASS_ATTENDANCE]: boolean
  [Permission.CAN_MANAGE_CLASS_CONTENT]: boolean

  // Parent Specific
  [Permission.CAN_VIEW_CHILD_GRADES]: boolean
  [Permission.CAN_VIEW_CHILD_ATTENDANCE]: boolean
  [Permission.CAN_VIEW_CHILD_SCHEDULE]: boolean
  [Permission.CAN_VIEW_CHILD_WALLET]: boolean
}

// Default permissions for each role
export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  [UserRole.SUPER_ADMIN]: {
    // All permissions enabled
    ...Object.values(Permission).reduce((acc, perm) => ({ ...acc, [perm]: true }), {}) as UserPermissions
  },

  [UserRole.ADMIN]: {
    // User Management
    [Permission.CAN_VIEW_USERS]: true,
    [Permission.CAN_CREATE_USERS]: true,
    [Permission.CAN_EDIT_USERS]: true,
    [Permission.CAN_DELETE_USERS]: false,
    [Permission.CAN_MANAGE_ROLES]: false,
    [Permission.CAN_MANAGE_ADMINS]: false,

    // School Management
    [Permission.CAN_VIEW_SCHOOL]: true,
    [Permission.CAN_EDIT_SCHOOL]: true,
    [Permission.CAN_MANAGE_SCHOOL]: true,
    [Permission.CAN_VIEW_DEPARTMENTS]: true,
    [Permission.CAN_EDIT_DEPARTMENTS]: true,
    [Permission.CAN_MANAGE_DEPARTMENTS]: true,

    // Class Management
    [Permission.CAN_VIEW_CLASSES]: true,
    [Permission.CAN_CREATE_CLASSES]: true,
    [Permission.CAN_EDIT_CLASSES]: true,
    [Permission.CAN_DELETE_CLASSES]: true,
    [Permission.CAN_ASSIGN_TEACHERS]: true,
    [Permission.CAN_MANAGE_CLASS_SCHEDULE]: true,

    // Subject Management
    [Permission.CAN_VIEW_SUBJECTS]: true,
    [Permission.CAN_CREATE_SUBJECTS]: true,
    [Permission.CAN_EDIT_SUBJECTS]: true,
    [Permission.CAN_DELETE_SUBJECTS]: true,
    [Permission.CAN_ASSIGN_SUBJECTS]: true,

    // Attendance System
    [Permission.CAN_VIEW_ATTENDANCE]: true,
    [Permission.CAN_MARK_ATTENDANCE]: true,
    [Permission.CAN_EDIT_ATTENDANCE]: true,
    [Permission.CAN_VIEW_ATTENDANCE_REPORTS]: true,
    [Permission.CAN_MANAGE_ATTENDANCE_RULES]: true,

    // Financial Management
    [Permission.CAN_VIEW_FINANCES]: true,
    [Permission.CAN_MANAGE_STUDENT_WALLET]: true,
    [Permission.CAN_MANAGE_CLASS_FUNDS]: true,
    [Permission.CAN_VIEW_FINANCIAL_REPORTS]: true,
    [Permission.CAN_APPROVE_EXPENSES]: true,
    [Permission.CAN_MANAGE_BUDGETS]: true,

    // Asset Management
    [Permission.CAN_VIEW_ASSETS]: true,
    [Permission.CAN_CREATE_ASSETS]: true,
    [Permission.CAN_EDIT_ASSETS]: true,
    [Permission.CAN_DELETE_ASSETS]: true,
    [Permission.CAN_ASSIGN_ASSETS]: true,
    [Permission.CAN_TRACK_ASSETS]: true,

    // Scheduling
    [Permission.CAN_VIEW_SCHEDULES]: true,
    [Permission.CAN_CREATE_SCHEDULES]: true,
    [Permission.CAN_EDIT_SCHEDULES]: true,
    [Permission.CAN_DELETE_SCHEDULES]: true,
    [Permission.CAN_MANAGE_DUTY_SCHEDULE]: true,
    [Permission.CAN_INTEGRATE_GOOGLE_CALENDAR]: true,

    // Reports & Analytics
    [Permission.CAN_VIEW_REPORTS]: true,
    [Permission.CAN_GENERATE_REPORTS]: true,
    [Permission.CAN_EXPORT_REPORTS]: true,
    [Permission.CAN_VIEW_ANALYTICS]: true,
    [Permission.CAN_VIEW_DASHBOARD_STATS]: true,

    // System Settings
    [Permission.CAN_VIEW_SETTINGS]: true,
    [Permission.CAN_EDIT_SETTINGS]: true,
    [Permission.CAN_MANAGE_SYSTEM]: false,
    [Permission.CAN_VIEW_LOGS]: true,
    [Permission.CAN_MANAGE_BACKUPS]: false,
    [Permission.CAN_MANAGE_LDAP]: false,

    // Network & Monitoring
    [Permission.CAN_VIEW_NETWORK_STATUS]: true,
    [Permission.CAN_MANAGE_NETWORK]: false,
    [Permission.CAN_VIEW_SYSTEM_MONITORING]: true,
    [Permission.CAN_MANAGE_SYSTEM_MONITORING]: false,

    // Helpdesk & Support
    [Permission.CAN_VIEW_HELPDESK]: true,
    [Permission.CAN_CREATE_TICKETS]: true,
    [Permission.CAN_EDIT_TICKETS]: true,
    [Permission.CAN_RESOLVE_TICKETS]: true,
    [Permission.CAN_MANAGE_HELPDESK]: true,

    // Mobile Features
    [Permission.CAN_ACCESS_MOBILE]: true,
    [Permission.CAN_USE_MOBILE_FEATURES]: true,
    [Permission.CAN_VIEW_MOBILE_DASHBOARD]: true,

    // Student Specific
    [Permission.CAN_VIEW_OWN_GRADES]: false,
    [Permission.CAN_VIEW_OWN_ATTENDANCE]: false,
    [Permission.CAN_VIEW_OWN_SCHEDULE]: false,
    [Permission.CAN_VIEW_OWN_WALLET]: false,

    // Teacher Specific
    [Permission.CAN_VIEW_CLASS_GRADES]: false,
    [Permission.CAN_EDIT_CLASS_GRADES]: false,
    [Permission.CAN_VIEW_CLASS_ATTENDANCE]: false,
    [Permission.CAN_MANAGE_CLASS_CONTENT]: false,

    // Parent Specific
    [Permission.CAN_VIEW_CHILD_GRADES]: false,
    [Permission.CAN_VIEW_CHILD_ATTENDANCE]: false,
    [Permission.CAN_VIEW_CHILD_SCHEDULE]: false,
    [Permission.CAN_VIEW_CHILD_WALLET]: false
  },

  [UserRole.MODERATOR]: {
    // Limited admin permissions
    ...Object.values(Permission).reduce((acc, perm) => ({ ...acc, [perm]: false }), {}) as UserPermissions,
    
    // View permissions only
    [Permission.CAN_VIEW_USERS]: true,
    [Permission.CAN_VIEW_SCHOOL]: true,
    [Permission.CAN_VIEW_CLASSES]: true,
    [Permission.CAN_VIEW_SUBJECTS]: true,
    [Permission.CAN_VIEW_ATTENDANCE]: true,
    [Permission.CAN_VIEW_FINANCES]: true,
    [Permission.CAN_VIEW_ASSETS]: true,
    [Permission.CAN_VIEW_SCHEDULES]: true,
    [Permission.CAN_VIEW_REPORTS]: true,
    [Permission.CAN_VIEW_ANALYTICS]: true,
    [Permission.CAN_VIEW_DASHBOARD_STATS]: true,
    [Permission.CAN_VIEW_SETTINGS]: true,
    [Permission.CAN_VIEW_HELPDESK]: true,
    [Permission.CAN_ACCESS_MOBILE]: true,
    [Permission.CAN_USE_MOBILE_FEATURES]: true,
    [Permission.CAN_VIEW_MOBILE_DASHBOARD]: true
  },

  [UserRole.TEACHER]: {
    // Teacher-specific permissions
    ...Object.values(Permission).reduce((acc, perm) => ({ ...acc, [perm]: false }), {}) as UserPermissions,
    
    [Permission.CAN_VIEW_OWN_GRADES]: true,
    [Permission.CAN_VIEW_OWN_ATTENDANCE]: true,
    [Permission.CAN_VIEW_OWN_SCHEDULE]: true,
    [Permission.CAN_VIEW_CLASS_GRADES]: true,
    [Permission.CAN_EDIT_CLASS_GRADES]: true,
    [Permission.CAN_VIEW_CLASS_ATTENDANCE]: true,
    [Permission.CAN_MARK_ATTENDANCE]: true,
    [Permission.CAN_VIEW_REPORTS]: true,
    [Permission.CAN_VIEW_ANALYTICS]: true,
    [Permission.CAN_ACCESS_MOBILE]: true,
    [Permission.CAN_USE_MOBILE_FEATURES]: true,
    [Permission.CAN_VIEW_MOBILE_DASHBOARD]: true
  },

  [UserRole.STUDENT]: {
    // Student-specific permissions
    ...Object.values(Permission).reduce((acc, perm) => ({ ...acc, [perm]: false }), {}) as UserPermissions,
    
    [Permission.CAN_VIEW_OWN_GRADES]: true,
    [Permission.CAN_VIEW_OWN_ATTENDANCE]: true,
    [Permission.CAN_VIEW_OWN_SCHEDULE]: true,
    [Permission.CAN_VIEW_OWN_WALLET]: true,
    [Permission.CAN_VIEW_REPORTS]: true,
    [Permission.CAN_ACCESS_MOBILE]: true,
    [Permission.CAN_USE_MOBILE_FEATURES]: true,
    [Permission.CAN_VIEW_MOBILE_DASHBOARD]: true
  },

  [UserRole.STAFF]: {
    // Staff-specific permissions
    ...Object.values(Permission).reduce((acc, perm) => ({ ...acc, [perm]: false }), {}) as UserPermissions,
    
    [Permission.CAN_VIEW_ATTENDANCE]: true,
    [Permission.CAN_MARK_ATTENDANCE]: true,
    [Permission.CAN_VIEW_REPORTS]: true,
    [Permission.CAN_VIEW_ANALYTICS]: true,
    [Permission.CAN_ACCESS_MOBILE]: true,
    [Permission.CAN_USE_MOBILE_FEATURES]: true,
    [Permission.CAN_VIEW_MOBILE_DASHBOARD]: true
  },

  [UserRole.PARENT]: {
    // Parent-specific permissions
    ...Object.values(Permission).reduce((acc, perm) => ({ ...acc, [perm]: false }), {}) as UserPermissions,
    
    [Permission.CAN_VIEW_CHILD_GRADES]: true,
    [Permission.CAN_VIEW_CHILD_ATTENDANCE]: true,
    [Permission.CAN_VIEW_CHILD_SCHEDULE]: true,
    [Permission.CAN_VIEW_CHILD_WALLET]: true,
    [Permission.CAN_VIEW_REPORTS]: true,
    [Permission.CAN_ACCESS_MOBILE]: true,
    [Permission.CAN_USE_MOBILE_FEATURES]: true,
    [Permission.CAN_VIEW_MOBILE_DASHBOARD]: true
  },

  [UserRole.USER]: {
    // Basic user permissions
    ...Object.values(Permission).reduce((acc, perm) => ({ ...acc, [perm]: false }), {}) as UserPermissions,
    
    [Permission.CAN_VIEW_REPORTS]: true,
    [Permission.CAN_ACCESS_MOBILE]: true,
    [Permission.CAN_USE_MOBILE_FEATURES]: true,
    [Permission.CAN_VIEW_MOBILE_DASHBOARD]: true
  }
}

// Helper functions
export function hasPermission(userPermissions: UserPermissions, permission: Permission): boolean {
  return userPermissions[permission] || false
}

export function hasAnyPermission(userPermissions: UserPermissions, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userPermissions, permission))
}

export function hasAllPermissions(userPermissions: UserPermissions, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userPermissions, permission))
}

export function getPermissionsForRole(role: UserRole): UserPermissions {
  return DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS[UserRole.USER]
}

export function canAccessFeature(userPermissions: UserPermissions, requiredPermissions: Permission[]): boolean {
  return hasAllPermissions(userPermissions, requiredPermissions)
}

// Feature access requirements
export const FEATURE_PERMISSIONS = {
  // Dashboard Features
  DASHBOARD_OVERVIEW: [Permission.CAN_VIEW_DASHBOARD_STATS],
  DASHBOARD_ANALYTICS: [Permission.CAN_VIEW_ANALYTICS],
  
  // School Management
  SCHOOL_MANAGEMENT: [Permission.CAN_VIEW_SCHOOL],
  SCHOOL_EDIT: [Permission.CAN_EDIT_SCHOOL],
  SCHOOL_DELETE: [Permission.CAN_MANAGE_SCHOOL],
  
  // User Management
  USER_MANAGEMENT: [Permission.CAN_VIEW_USERS],
  USER_CREATE: [Permission.CAN_CREATE_USERS],
  USER_EDIT: [Permission.CAN_EDIT_USERS],
  USER_DELETE: [Permission.CAN_DELETE_USERS],
  
  // Class Management
  CLASS_MANAGEMENT: [Permission.CAN_VIEW_CLASSES],
  CLASS_CREATE: [Permission.CAN_CREATE_CLASSES],
  CLASS_EDIT: [Permission.CAN_EDIT_CLASSES],
  CLASS_DELETE: [Permission.CAN_DELETE_CLASSES],
  
  // Financial Management
  FINANCIAL_OVERVIEW: [Permission.CAN_VIEW_FINANCES],
  STUDENT_WALLET: [Permission.CAN_MANAGE_STUDENT_WALLET],
  CLASS_FUNDS: [Permission.CAN_MANAGE_CLASS_FUNDS],
  
  // Mobile Features
  MOBILE_ACCESS: [Permission.CAN_ACCESS_MOBILE],
  MOBILE_DASHBOARD: [Permission.CAN_VIEW_MOBILE_DASHBOARD],
  
  // System Settings
  SYSTEM_SETTINGS: [Permission.CAN_VIEW_SETTINGS],
  SYSTEM_EDIT: [Permission.CAN_EDIT_SETTINGS],
  SYSTEM_MANAGE: [Permission.CAN_MANAGE_SYSTEM]
} as const
