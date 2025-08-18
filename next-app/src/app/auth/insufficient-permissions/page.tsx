'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Shield, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function InsufficientPermissionsContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const requiredRole = searchParams.get('requiredRole')
  const requiredPermissions = searchParams.get('requiredPermissions')

  const getErrorMessage = () => {
    switch (error) {
      case 'insufficient_permissions':
        return 'Anda tidak memiliki izin yang cukup untuk mengakses halaman ini.'
      case 'role_required':
        return `Halaman ini memerlukan role: ${requiredRole}`
      case 'permissions_required':
        return `Halaman ini memerlukan permissions: ${requiredPermissions}`
      default:
        return 'Terjadi kesalahan dalam autentikasi.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">
              Akses Ditolak
            </CardTitle>
            <CardDescription className="text-gray-600">
              {getErrorMessage()}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-800 font-medium">
                  Informasi Keamanan
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                Jika Anda yakin seharusnya memiliki akses ke halaman ini, 
                silakan hubungi administrator sistem.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/signin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Login dengan Akun Lain
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Error Code: {error || 'unknown'}</p>
              {requiredRole && <p>Required Role: {requiredRole}</p>}
              {requiredPermissions && <p>Required Permissions: {requiredPermissions}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function InsufficientPermissionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <InsufficientPermissionsContent />
    </Suspense>
  )
}
