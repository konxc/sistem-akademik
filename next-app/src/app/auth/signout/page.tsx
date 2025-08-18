"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, CheckCircle, Home } from "lucide-react"
import Link from "next/link"

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignedOut, setIsSignedOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Auto signout when page loads
    handleSignOut()
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)
    
    try {
      await signOut({ redirect: false })
      setIsSignedOut(true)
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSignedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Berhasil Logout!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Anda telah berhasil keluar dari sistem
            </p>
          </div>

          {/* Success Card */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-3">
                <p className="text-gray-600 dark:text-gray-400">
                  Terima kasih telah menggunakan sistem kami. Anda akan dialihkan ke beranda dalam beberapa detik.
                </p>
                
                <div className="flex space-x-3">
                  <Link href="/" className="flex-1">
                    <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      <Home className="mr-2 h-4 w-4" />
                      Kembali ke Beranda
                    </Button>
                  </Link>
                  
                  <Link href="/auth/signin" className="flex-1">
                    <Button variant="outline" className="w-full h-11">
                      <LogOut className="mr-2 h-4 w-4" />
                      Login Lagi
                    </Button>
                  </Link>
                </div>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <LogOut className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Logout
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sedang memproses logout...
          </p>
        </div>

        {/* Loading Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Memproses Logout
            </CardTitle>
            <CardDescription className="text-center">
              Mohon tunggu sebentar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Anda akan dialihkan dalam beberapa detik...</p>
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
