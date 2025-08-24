# 🐛 Debug Panel Component

Component debug panel yang dapat digunakan untuk debugging session, permissions, tRPC, dan data dalam aplikasi Next.js dengan tRPC.

## 📋 **Fitur Utama**

### 🔐 **Session Management**
- Status autentikasi real-time
- Informasi user dan role
- Debug session data
- Refresh session

### 🛡️ **Permission System**
- Role validation
- Admin access check
- Permission testing
- Role comparison

### 🌐 **tRPC Integration**
- Endpoint listing
- Connection testing
- Router validation
- Error debugging

### 📊 **Data Debugging**
- Form data inspection
- Query data analysis
- Mutation state tracking
- Environment information

## 🚀 **Cara Penggunaan**

### **1. Basic Usage**

```tsx
import { DebugPanel } from '@/components/debug/debug-panel'

function MyComponent() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  return (
    <div>
      <DebugPanel 
        session={session}
        status={status}
        isAdmin={isAdmin}
      />
      {/* Your component content */}
    </div>
  )
}
```

### **2. With Custom Debug Data**

```tsx
function MyComponent() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  
  // Custom debug data
  const debugData = {
    formData: { name: 'Test', email: 'test@example.com' },
    queryData: { page: 1, limit: 10 },
    mutationState: { isLoading: false, isError: false },
    customField: 'Custom value'
  }

  return (
    <div>
      <DebugPanel 
        session={session}
        status={status}
        isAdmin={isAdmin}
        debugData={debugData}
      />
    </div>
  )
}
```

### **3. Show in Production (Optional)**

```tsx
<DebugPanel 
  session={session}
  status={status}
  isAdmin={isAdmin}
  showInProduction={true} // Default: false
/>
```

## 🎯 **Props Interface**

```tsx
interface DebugPanelProps {
  session: any                    // NextAuth session object
  status: string                  // Session status ('loading', 'authenticated', 'unauthenticated')
  isAdmin: boolean               // Whether user has admin access
  debugData?: Record<string, any> // Custom debug data to display
  showInProduction?: boolean     // Whether to show in production (default: false)
}
```

## 🔧 **Tab Sections**

### **Session Tab**
- **Status**: Current authentication status
- **Role**: User role (ADMIN, USER, etc.)
- **User ID**: Unique user identifier
- **Email**: User email address
- **Actions**: Log session, log role, refresh page

### **Permissions Tab**
- **Admin Access**: Boolean admin status
- **Required Role**: Required role for access
- **Current Role**: User's current role
- **Actions**: Test permissions, validate role

### **tRPC Tab**
- **Available Endpoints**: List of tRPC procedures
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Admin Only**: Endpoints requiring admin access
- **Actions**: Test router, test connection

### **Data Tab**
- **Debug Data**: Custom data passed via props
- **Form Data**: Current form state
- **Query Data**: API query parameters
- **Actions**: Log all data, environment info

## 🛠️ **Quick Actions**

### **Console Management**
- **Clear Console**: Clear browser console
- **Clear Storage**: Clear localStorage and sessionStorage

### **Session Management**
- **Log Session**: Log session object to console
- **Log Role**: Log user role to console
- **Refresh**: Reload current page

### **Permission Testing**
- **Test Permissions**: Log permission details
- **Validate Role**: Log role validation info

### **tRPC Testing**
- **Test Router**: Log router information
- **Test Connection**: Log connection status

## 📱 **Responsive Design**

- **Collapsed View**: Compact information display
- **Expanded View**: Full tabbed interface
- **Mobile Friendly**: Responsive button layouts
- **Touch Optimized**: Large touch targets

## 🎨 **Styling & Theming**

### **Color Scheme**
- **Primary**: Blue theme for debug information
- **Success**: Green for positive states
- **Warning**: Yellow for caution states
- **Error**: Red for error states

### **Badge Variants**
- **Default**: Primary information
- **Secondary**: Secondary information
- **Outline**: Border-only style
- **Destructive**: Error/warning style

## 🔒 **Security Features**

### **Environment Protection**
- **Development Only**: Hidden in production by default
- **Optional Production**: Can be enabled with `showInProduction={true}`
- **Session Validation**: Only shows for authenticated users

### **Data Privacy**
- **No Sensitive Data**: Only displays safe debug information
- **Console Logging**: Debug data sent to console only
- **Local Storage**: No external data transmission

## 🚨 **Error Handling**

### **Graceful Degradation**
- **Missing Session**: Handles undefined session gracefully
- **Invalid Status**: Displays status safely
- **Missing Data**: Shows fallback values

### **Console Logging**
- **Error Logging**: Logs errors to console
- **Debug Information**: Provides context for debugging
- **Stack Traces**: Preserves error stack information

## 📊 **Performance Considerations**

### **Conditional Rendering**
- **Environment Check**: Only renders in development
- **Lazy Loading**: Tabs load content on demand
- **Minimal Re-renders**: Optimized state management

### **Memory Management**
- **Event Cleanup**: Proper event listener cleanup
- **State Optimization**: Minimal state updates
- **Component Lifecycle**: Proper mounting/unmounting

## 🔍 **Debugging Workflow**

### **1. Identify Issue**
```tsx
// Check session status
<DebugPanel session={session} status={status} isAdmin={isAdmin} />
```

### **2. Check Permissions**
```tsx
// Verify user role and permissions
// Use "Test Permissions" button
```

### **3. Validate tRPC**
```tsx
// Check tRPC connection and endpoints
// Use "Test Connection" button
```

### **4. Inspect Data**
```tsx
// Review form and query data
// Use "Log All Data" button
```

### **5. Environment Check**
```tsx
// Verify environment configuration
// Use "Environment Info" button
```

## 📝 **Best Practices**

### **Development Usage**
- **Always Include**: Add to components during development
- **Custom Data**: Pass relevant debug information
- **Console Monitoring**: Monitor console for debug output

### **Production Deployment**
- **Remove or Hide**: Set `showInProduction={false}` (default)
- **Conditional Import**: Import only in development
- **Bundle Optimization**: Exclude from production builds

### **Data Management**
- **Safe Data**: Only pass non-sensitive information
- **Structured Format**: Use consistent data structure
- **Regular Updates**: Keep debug data current

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. Component Not Visible**
```tsx
// Check environment
console.log('NODE_ENV:', process.env.NODE_ENV)

// Check showInProduction prop
<DebugPanel showInProduction={true} />
```

#### **2. Missing Session Data**
```tsx
// Verify NextAuth setup
import { useSession } from 'next-auth/react'

// Check session provider
<SessionProvider>
  <YourComponent />
</SessionProvider>
```

#### **3. tRPC Not Working**
```tsx
// Check tRPC provider
import { TrpcProvider } from '@/providers/TrpcProvider'

// Verify API endpoint
// Check /api/trpc route
```

### **Debug Commands**

#### **Console Commands**
```javascript
// Check session
console.log('Session:', session)

// Check role
console.log('Role:', session?.user?.role)

// Check permissions
console.log('Is Admin:', isAdmin)

// Check environment
console.log('NODE_ENV:', process.env.NODE_ENV)
```

#### **Network Tab**
- Check `/api/trpc` requests
- Verify response status codes
- Monitor request/response data

## 📚 **Examples**

### **School Management Component**
```tsx
function SchoolManagementPage() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  
  const debugData = {
    currentPage: 'school-management',
    userPermissions: ['CAN_VIEW_SCHOOL', 'CAN_EDIT_SCHOOL'],
    activeTab: 'classes',
    formState: { isEditing: false, isCreating: false }
  }

  return (
    <div>
      <DebugPanel 
        session={session}
        status={status}
        isAdmin={isAdmin}
        debugData={debugData}
      />
      
      {/* School management content */}
    </div>
  )
}
```

### **Form Component**
```tsx
function RombelForm() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const debugData = {
    formData,
    isSubmitting,
    validationErrors: [],
    submitAttempts: 0
  }

  return (
    <form>
      <DebugPanel 
        session={session}
        status={status}
        isAdmin={isAdmin}
        debugData={debugData}
      />
      
      {/* Form fields */}
    </form>
  )
}
```

## 🔄 **Updates & Maintenance**

### **Version History**
- **v1.0.0**: Initial release with basic debugging features
- **v1.1.0**: Added tabbed interface and custom data support
- **v1.2.0**: Enhanced permission testing and tRPC validation

### **Future Enhancements**
- **Real-time Updates**: Live data refresh
- **Export Functionality**: Export debug data
- **Custom Tabs**: User-defined tab sections
- **Performance Metrics**: Component performance data

## 🤝 **Contributing**

### **Adding New Features**
1. Fork the repository
2. Create feature branch
3. Implement new functionality
4. Add tests and documentation
5. Submit pull request

### **Bug Reports**
1. Check existing issues
2. Create detailed bug report
3. Include reproduction steps
4. Provide environment details

## 📄 **License**

This component is part of the Sistem Akademik project and follows the same license terms.

---

**Happy Debugging! 🐛✨**

Untuk pertanyaan atau bantuan, silakan buat issue di repository ini.
