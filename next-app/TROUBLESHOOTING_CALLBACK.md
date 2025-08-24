# 🔧 Troubleshooting Masalah Callback Autentikasi

## 🚨 **Gejala Masalah**

Ketika mengakses URL seperti:
```
https://preview-sia.smauiiyk.sch.id/auth/signin?callbackUrl=%2Fdashboard%2Fschool-management
```

Dan callback tidak berfungsi dengan benar setelah login.

## 🔍 **Penyebab Umum**

### 1. **Environment Variables Tidak Dikonfigurasi**
```bash
# Pastikan NEXTAUTH_URL sesuai dengan domain production
NEXTAUTH_URL="https://preview-sia.smauiiyk.sch.id"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 2. **Cookie Names Berbeda di Production**
- Development: `next-auth.session-token`
- Production: `__Secure-next-auth.session-token`

### 3. **HTTPS vs HTTP**
- Production harus menggunakan HTTPS
- Cookies secure tidak akan dikirim melalui HTTP

### 4. **Domain Mismatch**
- Pastikan domain di `NEXTAUTH_URL` sama dengan domain aplikasi

## 🛠️ **Solusi yang Sudah Diterapkan**

### 1. **Middleware yang Diperbaiki**
```typescript
// Pengecekan token yang lebih robust
const token = request.cookies.get('next-auth.session-token')?.value ||
              request.cookies.get('__Secure-next-auth.session-token')?.value ||
              request.cookies.get('__Host-next-auth.csrf-token')?.value

// Encoding callback URL yang proper
loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname))
```

### 2. **SignIn Page yang Diperbaiki**
```typescript
// Decode dan validasi callback URL
if (callbackUrl) {
  try {
    const decodedCallback = decodeURIComponent(callbackUrl)
    if (decodedCallback.startsWith('/dashboard')) {
      targetUrl = decodedCallback
    }
  } catch (error) {
    console.error('Error decoding callback URL:', error)
    targetUrl = '/dashboard'
  }
}
```

### 3. **NextAuth Configuration yang Diperbaiki**
```typescript
callbacks: {
  async redirect({ url, baseUrl }) {
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`
    } else if (new URL(url).origin === baseUrl) {
      return url
    }
    return baseUrl
  }
}
```

## 🔧 **Langkah Troubleshooting**

### **Step 1: Periksa Environment Variables**
```bash
# Di server production, pastikan:
echo $NEXTAUTH_URL
echo $NEXTAUTH_SECRET
echo $NODE_ENV
```

### **Step 2: Periksa Cookies**
```javascript
// Di browser console
console.log(document.cookie)
// Cari cookie yang mengandung 'next-auth'
```

### **Step 3: Periksa Network Tab**
- Buka Developer Tools > Network
- Lihat request ke `/api/auth/callback`
- Periksa response dan redirect

### **Step 4: Gunakan Debug Component**
- Komponen `AuthDebug` akan menampilkan informasi session
- Hanya tersedia di development mode

## 📋 **Checklist Konfigurasi Production**

- [ ] `NEXTAUTH_URL` = domain production yang benar
- [ ] `NEXTAUTH_SECRET` = secret key yang aman
- [ ] `NODE_ENV` = "production"
- [ ] HTTPS enabled
- [ ] Domain SSL certificate valid
- [ ] Database connection stable

## 🐛 **Debug Mode**

Untuk development, NextAuth debug mode sudah diaktifkan:
```typescript
debug: process.env.NODE_ENV === 'development'
```

## 📞 **Jika Masih Bermasalah**

1. **Periksa server logs** untuk error NextAuth
2. **Periksa browser console** untuk error JavaScript
3. **Periksa Network tab** untuk failed requests
4. **Gunakan komponen AuthDebug** untuk informasi session
5. **Periksa database** untuk user authentication

## 🔗 **Referensi**

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth.js Production Deployment](https://next-auth.js.org/deployment)
- [Cookie Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)
