# 🗑️ Troubleshooting Delete Rombel

Dokumentasi untuk mengatasi masalah pada fitur hapus rombel dalam aplikasi Sistem Akademik.

## ❌ **Masalah: Tombol Delete Tidak Berfungsi**

### **Gejala**
- Klik tombol delete tidak ada reaksi
- Tidak ada confirmation dialog
- Tidak ada error message
- Rombel tidak terhapus

### **Penyebab Umum**
1. **JavaScript Error**: Ada error di console browser
2. **Permission Issue**: User tidak memiliki akses admin
3. **State Management**: React state tidak ter-update
4. **API Call Failed**: tRPC mutation gagal
5. **Confirmation Dialog**: Browser block popup

## 🔍 **Diagnosis Step-by-Step**

### **Step 1: Check Browser Console**
1. Buka Developer Tools (F12)
2. Pilih tab Console
3. Cari error messages atau warnings
4. Periksa log messages yang dimulai dengan emoji

**Expected Logs:**
```
🔄 handleDeleteRombel called with ID: rombel-id-123
✅ User is admin, proceeding with delete confirmation
🔍 Delete confirmation result: true
🚀 Starting delete process...
📡 Calling deleteRombel.mutateAsync...
✅ Delete API call successful: {success: true, message: "Rombel berhasil dihapus"}
📝 Updating deletedRombels state...
🗑️ Updated deletedRombels: ["rombel-id-123"]
🎯 Set lastAction to delete
🎉 Delete process completed successfully
```

### **Step 2: Check User Permission**
1. Periksa apakah user sudah login
2. Verifikasi role user (ADMIN atau SUPER_ADMIN)
3. Check session data di console

**Expected Session:**
```javascript
{
  user: {
    id: "user-id",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN" // atau "SUPER_ADMIN"
  },
  status: "authenticated"
}
```

### **Step 3: Check Network Tab**
1. Buka Developer Tools → Network
2. Klik tombol delete rombel
3. Cari request ke `/api/trpc/rombel.delete`
4. Periksa response status dan body

**Expected Request:**
- **Method**: POST
- **URL**: `/api/trpc/rombel.delete`
- **Status**: 200 OK
- **Response**: `{"result":{"data":{"success":true,"message":"Rombel berhasil dihapus"}}}`

### **Step 4: Check React State**
1. Periksa state variables di console
2. Verifikasi `deletedRombels` dan `deletingRombels`
3. Check apakah state ter-update setelah delete

## 🛠️ **Solusi**

### **Solution 1: Fix JavaScript Errors**
Jika ada error di console:

```javascript
// Check for syntax errors
// Verify all imports are correct
// Ensure no undefined variables
```

### **Solution 2: Fix Permission Issues**
Pastikan user memiliki role yang benar:

```typescript
// Check session in component
const { data: session, status } = useSession()
const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

console.log('User role:', session?.user?.role)
console.log('Is admin:', isAdmin)
```

### **Solution 3: Fix State Management**
Pastikan state update bekerja dengan benar:

```typescript
// Use functional update for state
setDeletedRombels(prev => {
  const newSet = new Set(prev)
  newSet.add(rombelId)
  console.log('Updated deletedRombels:', Array.from(newSet))
  return newSet
})
```

### **Solution 4: Fix API Call**
Pastikan tRPC mutation bekerja:

```typescript
// Check mutation state
console.log('Delete mutation state:', {
  isPending: deleteRombel.isPending,
  isSuccess: deleteRombel.isSuccess,
  isError: deleteRombel.isError,
  error: deleteRombel.error
})
```

## 🧪 **Testing Delete Functionality**

### **Test 1: Basic Delete Flow**
```typescript
// 1. Click delete button
// 2. Confirm deletion
// 3. Check API call
// 4. Verify state update
// 5. Check UI feedback
```

### **Test 2: Permission Test**
```typescript
// 1. Login as non-admin user
// 2. Try to delete rombel
// 3. Verify error message
// 4. Check button disabled state
```

### **Test 3: Error Handling Test**
```typescript
// 1. Mock API error
// 2. Try to delete rombel
// 3. Verify error handling
// 4. Check state cleanup
```

## 🔧 **Debug Commands**

### **Console Commands**
```javascript
// Check rombel list
console.log('Rombel list:', rombelList)

// Check deleted rombels
console.log('Deleted rombels:', Array.from(deletedRombels))

// Check deleting rombels
console.log('Deleting rombels:', Array.from(deletingRombels))

// Check user session
console.log('Session:', session)
console.log('Is admin:', isAdmin)
```

### **Network Debug**
```javascript
// Check if API endpoint exists
fetch('/api/trpc/rombel.delete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ json: { id: 'test-id' } })
}).then(r => console.log('Response:', r))
```

## 📋 **Common Issues & Solutions**

### **Issue 1: "Cannot read property 'mutateAsync' of undefined"**
**Cause**: Hook `useDeleteRombel` tidak ter-import atau error
**Solution**: 
```typescript
import { useDeleteRombel } from '@/hooks/useRombel'
const deleteRombel = useDeleteRombel()
```

### **Issue 2: "User is not admin" error**
**Cause**: User tidak memiliki permission
**Solution**: 
```typescript
// Check user role in database
// Verify NextAuth configuration
// Check session callback
```

### **Issue 3: "Confirmation dialog not showing"**
**Cause**: Browser block popup atau JavaScript error
**Solution**: 
```typescript
// Use window.confirm instead of confirm
const isConfirmed = window.confirm('Are you sure?')
```

### **Issue 4: "State not updating"**
**Cause**: React state update issue
**Solution**: 
```typescript
// Use functional update
setDeletedRombels(prev => new Set(prev).add(rombelId))
```

### **Issue 5: "API call fails silently"**
**Cause**: Error handling tidak lengkap
**Solution**: 
```typescript
try {
  await deleteRombel.mutateAsync({ id: rombelId })
} catch (error) {
  console.error('Delete failed:', error)
  // Handle error appropriately
}
```

## 🚀 **Prevention**

### **1. Comprehensive Logging**
```typescript
console.log('🔄 handleDeleteRombel called with ID:', rombelId)
console.log('✅ User is admin, proceeding with delete')
console.log('🚀 Starting delete process...')
```

### **2. Error Boundaries**
```typescript
// Wrap delete operation in try-catch
try {
  // Delete logic
} catch (error) {
  console.error('Delete error:', error)
  // Show user-friendly error
}
```

### **3. State Validation**
```typescript
// Validate state before update
if (rombelId && typeof rombelId === 'string') {
  setDeletedRombels(prev => new Set(prev).add(rombelId))
}
```

### **4. User Feedback**
```typescript
// Show loading state
{deleteRombel.isPending && <Loader2 className="animate-spin" />}

// Show success message
toast.success('Rombel berhasil dihapus')

// Show error message
toast.error('Gagal menghapus rombel')
```

## 📊 **Monitoring & Analytics**

### **Success Metrics**
- Delete success rate
- User confirmation rate
- Error frequency
- Response time

### **Error Tracking**
- Error types
- Error frequency
- User impact
- Recovery time

## 📞 **Getting Help**

Jika masalah masih berlanjut:

1. **Check Console Logs**: Lihat semua log messages
2. **Verify Network Requests**: Periksa API calls
3. **Test with Different User**: Coba dengan user lain
4. **Check Database**: Verifikasi data rombel
5. **Create Issue**: Buat issue dengan detail lengkap

### **Issue Template**
```markdown
## Delete Rombel Issue

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- User Role: [ADMIN/SUPER_ADMIN]
- Rombel ID: [ID yang dicoba dihapus]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Console Logs:**
[Paste console logs here]

**Network Tab:**
[Paste network request details here]

**Additional Context:**
[Any other relevant information]
```

---

**Happy Debugging! 🐛✨**

Untuk bantuan lebih lanjut, silakan buat issue di repository ini.
