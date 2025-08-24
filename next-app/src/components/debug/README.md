# 🐛 Debug Components

Kumpulan component untuk debugging dan development yang dapat digunakan dalam aplikasi Next.js dengan tRPC.

## 📁 **File Structure**

```
src/components/debug/
├── debug-panel.tsx    # Main debug panel component
├── index.ts           # Export file
└── README.md          # This file
```

## 🚀 **Quick Start**

### **Import Component**

```tsx
import { DebugPanel } from '@/components/debug'
```

### **Basic Usage**

```tsx
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

## 🔧 **Features**

- **Session Debugging**: Authentication status and user info
- **Permission Testing**: Role validation and access control
- **tRPC Integration**: Endpoint testing and connection validation
- **Data Inspection**: Form data and state monitoring
- **Environment Info**: Development vs production detection

## 📚 **Documentation**

Lihat dokumentasi lengkap di: [`/docs/DEBUG_PANEL.md`](../../docs/DEBUG_PANEL.md)

## 🎯 **Use Cases**

- **Development**: Debug authentication issues
- **Testing**: Validate permission systems
- **Troubleshooting**: Identify tRPC connection problems
- **QA**: Verify user role assignments

## 🔒 **Security**

- **Development Only**: Hidden in production by default
- **Safe Data**: No sensitive information exposure
- **Console Logging**: Debug data sent to console only

---

**Happy Debugging! 🐛✨**
