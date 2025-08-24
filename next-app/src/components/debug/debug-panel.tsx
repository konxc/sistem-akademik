'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Bug, Database, User, Key, RefreshCw, AlertTriangle } from 'lucide-react'

interface DebugPanelProps {
  session: any
  status: string
  isAdmin: boolean
  debugData?: Record<string, any>
  showInProduction?: boolean
}

export function DebugPanel({ 
  session, 
  status, 
  isAdmin, 
  debugData = {},
  showInProduction = false 
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'session' | 'permissions' | 'trpc' | 'data'>('session')

  // Hanya tampilkan di development atau jika showInProduction = true
  if (process.env.NODE_ENV !== 'development' && !showInProduction) {
    return null
  }

  const tabs = [
    { id: 'session', label: 'Session', icon: User },
    { id: 'permissions', label: 'Permissions', icon: Key },
    { id: 'trpc', label: 'tRPC', icon: Database },
    { id: 'data', label: 'Data', icon: Bug }
  ] as const

  const renderSessionInfo = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium text-blue-700">Status:</span>
          <Badge variant={status === 'authenticated' ? 'default' : 'secondary'} className="ml-2">
            {status}
          </Badge>
        </div>
        <div>
          <span className="font-medium text-blue-700">Role:</span>
          <Badge variant={isAdmin ? 'default' : 'secondary'} className="ml-2">
            {session?.user?.role || 'Tidak ada'}
          </Badge>
        </div>
        <div>
          <span className="font-medium text-blue-700">User ID:</span>
          <span className="ml-2 font-mono text-xs">{session?.user?.id || 'Tidak ada'}</span>
        </div>
        <div>
          <span className="font-medium text-blue-700">Email:</span>
          <span className="ml-2">{session?.user?.email || 'Tidak ada'}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => console.log('Session:', session)}
          className="text-xs"
        >
          Log Session
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => console.log('User Role:', session?.user?.role)}
          className="text-xs ml-2"
        >
          Log Role
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="text-xs ml-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>
    </div>
  )

  const renderPermissionsInfo = () => (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-blue-700">Admin Access:</span>
          <Badge variant={isAdmin ? 'default' : 'destructive'}>
            {isAdmin ? 'Ya' : 'Tidak'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-blue-700">Required Role:</span>
          <Badge variant="outline">ADMIN or SUPER_ADMIN</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-blue-700">Current Role:</span>
          <Badge variant="outline">{session?.user?.role || 'USER'}</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            console.log('Permission Check:')
            console.log('- Current role:', session?.user?.role)
            console.log('- Required role: ADMIN or SUPER_ADMIN')
            console.log('- Has permission:', isAdmin)
            console.log('- Can create:', isAdmin)
            console.log('- Can edit:', isAdmin)
            console.log('- Can delete:', isAdmin)
          }}
          className="text-xs"
        >
          Test Permissions
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            console.log('Role Validation:')
            console.log('- User:', session?.user)
            console.log('- Role:', session?.user?.role)
            console.log('- Is Admin:', isAdmin)
            console.log('- Is Super Admin:', session?.user?.role === 'SUPER_ADMIN')
          }}
          className="text-xs ml-2"
        >
          Validate Role
        </Button>
      </div>
    </div>
  )

  const renderTrpcInfo = () => (
    <div className="space-y-3">
      <div className="space-y-2">
        <h4 className="font-medium text-blue-700">Available Endpoints:</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">GET</Badge>
            <span>rombel.getAll</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">GET</Badge>
            <span>rombel.getByClass</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">GET</Badge>
            <span>rombel.getById</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">POST</Badge>
            <span>rombel.create</span>
            <Badge variant="secondary" className="text-xs">Admin Only</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">PUT</Badge>
            <span>rombel.update</span>
            <Badge variant="secondary" className="text-xs">Admin Only</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">DELETE</Badge>
            <span>rombel.delete</span>
            <Badge variant="secondary" className="text-xs">Admin Only</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            console.log('tRPC Router Info:')
            console.log('Available endpoints listed above')
            console.log('Check network tab for API calls')
            console.log('Check console for tRPC errors')
          }}
          className="text-xs"
        >
          Test Router
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            console.log('tRPC Connection Test:')
            console.log('Check if /api/trpc endpoint is accessible')
            console.log('Check if tRPC provider is working')
            console.log('Check if mutations are available')
          }}
          className="text-xs ml-2"
        >
          Test Connection
        </Button>
      </div>
    </div>
  )

  const renderDataInfo = () => (
    <div className="space-y-3">
      <div className="space-y-2">
        <h4 className="font-medium text-blue-700">Debug Data:</h4>
        {Object.entries(debugData).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="font-medium text-blue-700">{key}:</span>
            <span className="text-sm">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            console.log('Debug Data:', debugData)
            console.log('Form Data:', debugData.formData)
            console.log('Query Data:', debugData.queryData)
            console.log('Mutation State:', debugData.mutationState)
          }}
          className="text-xs"
        >
          Log All Data
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => {
            console.log('Environment Info:')
            console.log('- NODE_ENV:', process.env.NODE_ENV)
            console.log('- Base URL:', window.location.origin)
            console.log('- Current Path:', window.location.pathname)
            console.log('- User Agent:', navigator.userAgent)
          }}
          className="text-xs ml-2"
        >
          Environment Info
        </Button>
      </div>
    </div>
  )

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-800">
          <Bug className="h-4 w-4" />
          <span className="text-sm font-medium">Debug Panel</span>
          <Badge variant="outline" className="text-xs">
            {process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex space-x-1 border-b border-blue-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-500'
                      : 'text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <Icon className="h-3 w-3 inline mr-1" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === 'session' && renderSessionInfo()}
            {activeTab === 'permissions' && renderPermissionsInfo()}
            {activeTab === 'trpc' && renderTrpcInfo()}
            {activeTab === 'data' && renderDataInfo()}
          </div>

          {/* Quick Actions */}
          <div className="pt-3 border-t border-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-700">Quick Actions:</span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  console.clear()
                  console.log('Console cleared')
                }}
                className="text-xs"
              >
                Clear Console
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  localStorage.clear()
                  sessionStorage.clear()
                  console.log('Storage cleared')
                }}
                className="text-xs"
              >
                Clear Storage
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed View */}
      {!isExpanded && (
        <div className="flex items-center gap-4 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <Shield className="h-3 w-3" />
            <span>Role: {session?.user?.role || 'None'}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span>Status: {status}</span>
          </div>
          <div className="flex items-center gap-2">
            <Key className="h-3 w-3" />
            <span>Admin: {isAdmin ? 'Yes' : 'No'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
