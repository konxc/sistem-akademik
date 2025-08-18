"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, School, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Here you would typically make an API call to send reset password email
      // For now, we'll simulate a successful email send
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess(true)
    } catch (error) {
      setError("Terjadi kesalahan saat mengirim email reset password")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Email Terkirim!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kami telah mengirim instruksi reset password ke email Anda
            </p>
          </div>

          {/* Success Card */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="pt-6 space-y-4">
              <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Email reset password telah dikirim ke <strong>{email}</strong>. 
                  Silakan cek inbox atau folder spam Anda.
                </AlertDescription>
              </Alert>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>Jika Anda tidak menerima email dalam beberapa menit:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Periksa folder spam atau junk</li>
                  <li>Pastikan alamat email yang dimasukkan benar</li>
                  <li>Coba lagi dalam beberapa menit</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Kirim Ulang Email
                </Button>
                
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="w-full h-11"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Login
                  </Button>
                </Link>
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
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center">
              <School className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Lupa Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Masukkan email Anda untuk reset password
          </p>
        </div>

        {/* Reset Password Form */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Kami akan mengirim instruksi reset password ke email Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@sekolah.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Email Reset"
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="inline mr-1 h-3 w-3" />
                Kembali ke Login
              </Link>
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
