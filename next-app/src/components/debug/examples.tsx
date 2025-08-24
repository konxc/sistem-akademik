'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { DebugPanel } from './debug-panel'

// Contoh 1: Basic Usage
export function BasicDebugExample() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Basic Debug Example</h2>
      <DebugPanel 
        session={session}
        status={status}
        isAdmin={isAdmin}
      />
      <p>Your component content here...</p>
    </div>
  )
}

// Contoh 2: With Custom Debug Data
export function CustomDataDebugExample() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const debugData = {
    formData,
    isSubmitting,
    validationErrors: [],
    submitAttempts: 0,
    currentTime: new Date().toISOString(),
    userAgent: navigator.userAgent
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Custom Data Debug Example</h2>
      <DebugPanel 
        session={session}
        status={status}
        isAdmin={isAdmin}
        debugData={debugData}
      />
      
      <form className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsSubmitting(!isSubmitting)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Toggle Submitting
        </button>
      </form>
    </div>
  )
}

// Contoh 3: Form Component with Debug
export function FormDebugExample() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    category: '',
    isActive: false
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const debugData = {
    formState,
    errors,
    isLoading,
    hasErrors: errors.length > 0,
    isFormValid: formState.name && formState.description && formState.category,
    formHistory: [
      { timestamp: new Date().toISOString(), action: 'Form initialized' }
    ]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (!formState.name) {
        setErrors(['Name is required'])
      } else {
        setErrors([])
        alert('Form submitted successfully!')
      }
    }, 1000)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Form Debug Example</h2>
      <DebugPanel 
        session={session}
        status={status}
        isAdmin={isAdmin}
        debugData={debugData}
      />
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description:</label>
          <textarea
            value={formState.description}
            onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category:</label>
          <select
            value={formState.category}
            onChange={(e) => setFormState(prev => ({ ...prev, category: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select category</option>
            <option value="tech">Technology</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
          </select>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(e) => setFormState(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2"
            />
            <span className="text-sm font-medium">Active</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <h3 className="font-medium text-red-800">Errors:</h3>
          <ul className="mt-1 text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Contoh 4: Table Component with Debug
export function TableDebugExample() {
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  
  const [data, setData] = useState([
    { id: 1, name: 'Item 1', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'Item 2', status: 'inactive', createdAt: '2024-01-02' },
    { id: 3, name: 'Item 3', status: 'active', createdAt: '2024-01-03' }
  ])
  
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  })
  
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  const filteredData = data.filter(item => {
    if (filters.status && item.status !== filters.status) return false
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })
  
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a]
    const bVal = b[sortBy as keyof typeof b]
    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })
  
  const debugData = {
    originalData: data,
    filteredData,
    sortedData,
    filters,
    sortBy,
    sortOrder,
    totalItems: data.length,
    filteredItems: filteredData.length,
    sortOptions: ['id', 'name', 'status', 'createdAt']
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Table Debug Example</h2>
      <DebugPanel 
        session={session}
        status={status}
        isAdmin={isAdmin}
        debugData={debugData}
      />
      
      <div className="space-y-4 mt-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium">Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border rounded px-3 py-2"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Search:</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search items..."
              className="border rounded px-3 py-2"
            />
          </div>
        </div>
        
        {/* Sort */}
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="createdAt">Created At</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border rounded px-3 py-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        {/* Table */}
        <div className="border rounded">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {data.length} items
        </div>
      </div>
    </div>
  )
}
