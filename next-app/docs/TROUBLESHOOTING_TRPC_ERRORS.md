# 🚨 Troubleshooting tRPC Errors

Dokumentasi untuk mengatasi error umum pada tRPC dalam aplikasi Sistem Akademik.

## ❌ **Error: "Unexpected token '<', "<html>..." is not valid JSON**

### **Deskripsi Error**
```
TRPCClientError: Unexpected token '<', "<html>..." is not valid JSON
```

### **Penyebab Umum**
Error ini terjadi ketika server mengembalikan HTML alih-alih JSON yang diharapkan. Ini biasanya menandakan:

1. **Server Error**: Server mengalami crash atau error internal
2. **Route Not Found**: Endpoint tRPC tidak ditemukan
3. **Authentication Error**: Middleware authentication gagal
4. **Database Error**: Prisma atau database connection error
5. **Validation Error**: Schema validation gagal

### 🔍 **Diagnosis**

#### **1. Check Browser Network Tab**
- Buka Developer Tools → Network
- Cari request ke `/api/trpc/rombel.create`
- Periksa Response tab
- Jika response berisi HTML, ada masalah server

#### **2. Check Server Console**
- Lihat terminal yang menjalankan `npm run dev`
- Cari error messages atau stack traces
- Periksa apakah server crash

#### **3. Check tRPC Endpoint**
- Pastikan endpoint `/api/trpc/[trpc]/route.ts` ada
- Verifikasi router configuration
- Test endpoint dengan tool seperti Postman

### 🛠️ **Solusi**

#### **1. Restart Development Server**
```bash
# Stop server (Ctrl+C)
# Restart server
npm run dev
```

#### **2. Check tRPC Configuration**
Pastikan file berikut sudah benar:

**`src/server/trpc.ts`**
```typescript
import { initTRPC, TRPCError } from '@trpc/server';

const t = initTRPC.create();

// Middleware untuk authentication
const isAuthed = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Anda harus login terlebih dahulu',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: session.user,
    },
  });
});

// Middleware untuk role-based access
const isAdmin = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Anda tidak memiliki akses ke fitur ini',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: session.user,
    },
  });
});

// Export procedures
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
```

**`src/server/routers/index.ts`**
```typescript
import { createTRPCRouter } from '../trpc';
import { schoolRouter } from './school';
import { rombelRouter } from './rombel';
import { classRouter } from './class';

export const appRouter = createTRPCRouter({
  school: schoolRouter,
  rombel: rombelRouter,
  class: classRouter,
});

export type AppRouter = typeof appRouter;
```

**`src/app/api/trpc/[trpc]/route.ts`**
```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers';
import { createContext } from '@/server/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
  });

export { handler as GET, handler as POST };
```

#### **3. Check Database Connection**
Pastikan Prisma database connection berfungsi:

```bash
# Test database connection
npx prisma db push

# Check database status
npx prisma studio
```

#### **4. Check Authentication**
Pastikan NextAuth configuration benar:

**`src/lib/auth.ts`**
```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    // ... your providers
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        role: token.role,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
};
```

#### **5. Check Environment Variables**
Pastikan semua environment variables sudah diset:

```bash
# .env.local
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 🧪 **Testing tRPC Endpoint**

#### **1. Simple Test Script**
Buat file `test-trcp-endpoint.js`:

```javascript
const testTRPCEndpoint = async () => {
  try {
    console.log('Testing tRPC endpoint...')
    
    const response = await fetch('http://localhost:3000/api/trpc/rombel.getByClass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: {
          classId: 'test-class-id'
        }
      })
    })
    
    console.log('Response status:', response.status)
    const text = await response.text()
    console.log('Response body:', text.substring(0, 200))
    
  } catch (error) {
    console.error('Request failed:', error.message)
  }
}

testTRPCEndpoint()
```

#### **2. Run Test**
```bash
node test-trcp-endpoint.js
```

### 🔧 **Debug Steps**

#### **Step 1: Verify Server Status**
```bash
# Check if server is running
curl http://localhost:3000/api/trpc/rombel.getByClass

# Expected: Should return some response (even if error)
```

#### **Step 2: Check tRPC Router**
```bash
# Verify router is loaded
# Check browser console for tRPC errors
# Look for "No queries found" or similar errors
```

#### **Step 3: Check Authentication**
```bash
# Verify user is logged in
# Check session in browser
# Verify user role is ADMIN or SUPER_ADMIN
```

#### **Step 4: Check Database**
```bash
# Verify Prisma can connect
npx prisma db push

# Check if tables exist
npx prisma studio
```

### 📋 **Common Issues & Solutions**

#### **Issue 1: "No queries found"**
**Solution**: Check router configuration and make sure all procedures are properly exported.

#### **Issue 2: "Database connection failed"**
**Solution**: Verify DATABASE_URL and restart server.

#### **Issue 3: "Authentication failed"**
**Solution**: Check NextAuth configuration and session handling.

#### **Issue 4: "Schema validation failed"**
**Solution**: Verify input data matches Zod schema requirements.

### 🚀 **Prevention**

#### **1. Error Handling**
Implement proper error handling in tRPC procedures:

```typescript
try {
  // Your logic here
} catch (error) {
  if (error instanceof TRPCError) throw error
  
  console.error('Unexpected error:', error)
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Terjadi kesalahan internal',
    cause: error,
  })
}
```

#### **2. Input Validation**
Always validate input with Zod schemas:

```typescript
.input(createRombelSchema)
.mutation(async ({ input }) => {
  // input is now type-safe
})
```

#### **3. Logging**
Add comprehensive logging for debugging:

```typescript
console.log('Creating rombel with data:', input)
console.log('User session:', ctx.session)
```

### 📞 **Getting Help**

Jika masalah masih berlanjut:

1. **Check GitHub Issues**: Lihat apakah ada issue serupa
2. **Check tRPC Documentation**: [tRPC.io](https://trpc.io)
3. **Check Next.js Documentation**: [Next.js](https://nextjs.org)
4. **Create Issue**: Buat issue baru dengan detail error

### 📊 **Error Log Template**

Saat melaporkan error, sertakan:

```markdown
## Error Details
- **Error Message**: [Paste error message]
- **Error Code**: [If any]
- **Stack Trace**: [If available]

## Environment
- **Node Version**: [node --version]
- **Next.js Version**: [package.json]
- **tRPC Version**: [package.json]
- **Database**: [PostgreSQL/MySQL/etc]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happened]

## Additional Context
[Any other relevant information]
```

---

**Happy Debugging! 🐛✨**

Untuk bantuan lebih lanjut, silakan buat issue di repository ini.
