# 🛡️ Route Protection System

Sistem proteksi route untuk dashboard yang memastikan hanya user yang sudah login dan memiliki permission yang tepat yang bisa mengakses halaman tertentu.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Middleware    │───▶│  Route Guard     │───▶│  HOC Wrapper   │
│   (Server)      │    │  (Client)        │    │  (Component)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔐 **Layers of Protection**

### **1. Middleware (Server-Side)**
- **File**: `src/middleware.ts`
- **Function**: Intercept semua requests sebelum sampai ke component
- **Protection**: Check session token di cookies
- **Redirect**: Unauthenticated users → `/auth/signin`

### **2. Route Guard (Client-Side)**
- **File**: `src/components/auth/route-guard.tsx`
- **Function**: Component wrapper untuk proteksi route
- **Protection**: Check session status, role, dan permissions
- **Features**: Loading states, error handling, redirects

### **3. HOC Wrapper (Component-Level)**
- **File**: `src/components/auth/with-auth.tsx`
- **Function**: Higher-Order Component untuk wrapping components
- **Protection**: Same as Route Guard but more flexible
- **Usage**: `withAdminAuth(Component)`, `withPermissionAuth(Component, permissions)`

## 🚀 **Usage Examples**

### **Basic Route Protection**
```tsx
// Layout level protection
import { RouteGuard } from '@/components/auth/route-guard'

export default function DashboardLayout({ children }) {
  return (
    <RouteGuard>
      <div>{children}</div>
    </RouteGuard>
  )
}
```

### **Role-Based Protection**
```tsx
// Admin only access
import { AdminRouteGuard } from '@/components/auth/route-guard'

export default function AdminPage() {
  return (
    <AdminRouteGuard>
      <div>Admin only content</div>
    </AdminRouteGuard>
  )
}
```

### **Permission-Based Protection**
```tsx
// Specific permissions required
import { PermissionRouteGuard } from '@/components/auth/route-guard'

export default function UserManagementPage() {
  return (
    <PermissionRouteGuard permissions={['CAN_VIEW_USERS', 'CAN_EDIT_USERS']}>
      <div>User management content</div>
    </PermissionRouteGuard>
  )
}
```

### **HOC Protection**
```tsx
// Using Higher-Order Component
import { withAdminAuth } from '@/components/auth/with-auth'

function SchoolManagementPage() {
  return <div>School management content</div>
}

export default withAdminAuth(SchoolManagementPage)
```

## 📋 **Protected Routes**

### **Dashboard Routes**
- `/dashboard` - Main dashboard
- `/dashboard/school-management` - School information management
- `/dashboard/users` - User management
- `/dashboard/students` - Student management
- `/dashboard/teachers` - Teacher management
- `/dashboard/staff` - Staff management
- `/dashboard/subjects` - Subject management
- `/dashboard/classes` - Class management
- `/dashboard/departments` - Department management
- `/dashboard/majors` - Major management
- `/dashboard/academic-years` - Academic year management

### **Public Routes**
- `/` - Home page
- `/auth/signin` - Login page
- `/auth/signup` - Registration page
- `/auth/forgot-password` - Password reset
- `/auth/error` - Error page
- `/api/auth` - Authentication API
- `/api/trpc` - tRPC API

## 🔒 **Authentication Flow**

```
1. User mengakses protected route
2. Middleware check session token
3. Jika tidak ada token → redirect ke /auth/signin
4. Jika ada token → Route Guard check session
5. Jika session valid → check role/permissions
6. Jika authorized → render component
7. Jika unauthorized → redirect ke /auth/error
```

## 🎯 **Role-Based Access Control (RBAC)**

### **Available Roles**
- `SUPER_ADMIN` - Full system access
- `ADMIN` - School-level administration
- `MODERATOR` - Limited administration
- `TEACHER` - Teacher-specific features
- `STUDENT` - Student-specific features
- `STAFF` - Staff-specific features
- `PARENT` - Parent-specific features
- `USER` - Basic user access

### **Permission Examples**
- `CAN_VIEW_USERS` - View user list
- `CAN_EDIT_USERS` - Edit user information
- `CAN_DELETE_USERS` - Delete users
- `CAN_VIEW_SCHOOL` - View school information
- `CAN_EDIT_SCHOOL` - Edit school information
- `CAN_VIEW_STUDENTS` - View student data
- `CAN_EDIT_STUDENTS` - Edit student data

## 🛠️ **Configuration**

### **Environment Variables**
```env
# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL="postgresql://..."
```

### **NextAuth Configuration**
```tsx
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // ... credentials config
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role
        token.permissions = user.permissions
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.role = token.role
        session.user.permissions = token.permissions
      }
      return session
    }
  }
}
```

## 🚨 **Error Handling**

### **Error Types**
- `insufficient_permissions` - User lacks required permissions
- `role_required` - Specific role required
- `permissions_required` - Specific permissions required
- `Configuration` - Server configuration error
- `AccessDenied` - Access denied
- `Verification` - Verification link invalid

### **Error Pages**
- `/auth/error` - Generic error page
- `/auth/insufficient-permissions` - Permission error page

## 🔍 **Debugging & Testing**

### **Console Logs**
```tsx
// Check session status
console.log('Session:', session)
console.log('User role:', session?.user?.role)
console.log('User permissions:', session?.user?.permissions)
```

### **Network Tab**
- Check API calls to `/api/auth/session`
- Verify redirects
- Check cookie values

### **Common Issues**
1. **Session not persisting** - Check NextAuth configuration
2. **Role not updating** - Verify database user role
3. **Permissions not working** - Check user permissions in database
4. **Redirect loops** - Verify middleware logic

## 📚 **Best Practices**

### **Security**
1. **Always validate on server-side** - Don't rely only on client-side checks
2. **Use HTTPS in production** - Secure cookie transmission
3. **Implement rate limiting** - Prevent brute force attacks
4. **Log security events** - Monitor suspicious activities

### **Performance**
1. **Lazy load protected components** - Reduce initial bundle size
2. **Cache session data** - Minimize API calls
3. **Optimize middleware** - Keep middleware lightweight

### **User Experience**
1. **Clear error messages** - Help users understand issues
2. **Smooth redirects** - Don't break user flow
3. **Loading states** - Show progress during authentication
4. **Remember intended destination** - Use callbackUrl for better UX

## 🚀 **Deployment Considerations**

### **Production Setup**
1. **Set secure cookies** - Use `__Secure-` prefix
2. **Configure CORS** - Restrict cross-origin requests
3. **Set proper headers** - Security headers
4. **Monitor logs** - Track authentication attempts

### **Environment Differences**
- **Development**: HTTP, localhost
- **Production**: HTTPS, secure domain
- **Staging**: Similar to production

## 🔧 **Customization**

### **Custom Guards**
```tsx
// Custom permission guard
export function CustomGuard({ children, customCheck }) {
  const { data: session } = useSession()
  
  if (!customCheck(session)) {
    return <div>Custom access denied</div>
  }
  
  return <>{children}</>
}
```

### **Custom Middleware**
```tsx
// Custom middleware logic
export function middleware(request: NextRequest) {
  // Custom authentication logic
  const customAuth = checkCustomAuth(request)
  
  if (!customAuth) {
    return NextResponse.redirect(new URL('/custom-login', request.url))
  }
  
  return NextResponse.next()
}
```

## 📖 **Additional Resources**

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [React Higher-Order Components](https://react.dev/reference/react/Component#caveats)
- [Role-Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control)
