"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return "Ada masalah dengan konfigurasi server. Silakan hubungi administrator."
      case "AccessDenied":
        return "Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini."
      case "Verification":
        return "Link verifikasi tidak valid atau sudah kadaluarsa."
      case "Default":
        return "Terjadi kesalahan saat autentikasi. Silakan coba lagi."
      case "insufficient_permissions":
        return "Anda tidak memiliki izin yang cukup untuk mengakses halaman ini."
      case "role_required":
        return "Halaman ini memerlukan role tertentu."
      case "permissions_required":
        return "Halaman ini memerlukan permissions tertentu."
      default:
        return "Terjadi kesalahan saat autentikasi. Silakan coba lagi."
    }
  }

  const getErrorTitle = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return "Error Konfigurasi"
      case "AccessDenied":
        return "Akses Ditolak"
      case "Verification":
        return "Verifikasi Gagal"
      case "Default":
      default:
        return "Error Autentikasi"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Oops! Terjadi Kesalahan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getErrorTitle(error)}
          </p>
        </div>

        {/* Error Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center text-red-600 dark:text-red-400">
              {getErrorTitle(error)}
            </CardTitle>
            <CardDescription className="text-center">
              Mohon maaf atas ketidaknyamanannya
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>

            {/* Error Code */}
            {error && (
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kode Error: <span className="font-mono font-medium">{error}</span>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/auth/signin">
                <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  Coba Login Lagi
                </Button>
              </Link>
              
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full h-11"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="w-full h-11"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Halaman
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>
                Jika masalah berlanjut, silakan{" "}
                <Link
                  href="/contact"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  hubungi support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2024 SMA UII. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
