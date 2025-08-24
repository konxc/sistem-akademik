"use client"

import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"
import { useState } from "react"

export function AuthDebug() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl')
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const debugInfo = {
    sessionStatus: status,
    hasSession: !!session,
    userId: session?.user?.id || 'N/A',
    userEmail: session?.user?.email || 'N/A',
    userRole: session?.user?.role || 'N/A',
    callbackUrl: callbackUrl || 'N/A',
    currentUrl: currentUrl,
    cookies: typeof document !== 'undefined' ? document.cookie : 'N/A',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const refreshSession = () => {
    window.location.reload()
  }

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show debug info in production
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Auth Debug Info
          <Button
            variant="outline"
            size="sm"
            onClick={refreshSession}
            className="ml-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Session Status</h4>
            <Badge variant={status === 'authenticated' ? 'default' : 'secondary'}>
              {status}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">User Info</h4>
            <div className="text-sm space-y-1">
              <div>ID: {debugInfo.userId}</div>
              <div>Email: {debugInfo.userEmail}</div>
              <div>Role: {debugInfo.userRole}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Callback URL</h4>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
              {debugInfo.callbackUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(debugInfo.callbackUrl)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Current URL</h4>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 break-all">
              {debugInfo.currentUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(debugInfo.currentUrl)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Cookies</h4>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 break-all">
              {debugInfo.cookies}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(debugInfo.cookies)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {copied && (
          <div className="text-green-600 text-sm text-center">
            ✅ Copied to clipboard!
          </div>
        )}
      </CardContent>
    </Card>
  )
}
