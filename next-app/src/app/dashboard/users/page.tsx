"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, MoreHorizontal, UserCheck, Users, GraduationCap, Briefcase, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSchools } from '@/hooks/use-school'

import { CreateUserModal } from '@/components/users/create-user-modal'
import { EditUserModal } from '@/components/users/edit-user-modal'
import { ViewUserModal } from '@/components/users/view-user-modal'
import { useUsers, useDeleteUser } from '@/hooks/useUser'
import { toast } from 'sonner'

function UsersPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilterCard, setShowFilterCard] = useState(() => {
    // Get from localStorage on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem('users-filter-visible') === 'true'
    }
    return false
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createInitialRole, setCreateInitialRole] = useState<'student'|'teacher'|'staff'|'admin'>('student')
  const [editingUser, setEditingUser] = useState<any>(null)
  const [viewingUser, setViewingUser] = useState<any>(null)
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    isActive: 'all',
    classId: 'all',
    majorId: 'all'
  })

  // Get tab from URL params
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get active tab from URL query parameter
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab') || 'students'
    return tab === "teachers" ? "teachers" : tab === "staff" ? "staff" : "students"
  })

  const { data: schoolsData, isLoading: isLoadingSchools } = useSchools({ page: 1, limit: 1 })
  
  const schoolId = useMemo(() => {
    const school = schoolsData?.data?.[0]
    return school?.id || ''
  }, [schoolsData?.data])

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const params = new URLSearchParams(searchParams)
    if (tabId === "teachers") {
      params.set('tab', 'teachers')
      setFilters(prev => ({ ...prev, role: 'TEACHER' }))
    } else if (tabId === "staff") {
      params.set('tab', 'staff')
      setFilters(prev => ({ ...prev, role: 'STAFF' }))
    } else {
      params.set('tab', 'students')
      setFilters(prev => ({ ...prev, role: 'STUDENT' }))
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  // Sync with URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'students'
    if (tab === "teachers") {
      setActiveTab("teachers")
      setFilters(prev => ({ ...prev, role: 'TEACHER' }))
    } else if (tab === "staff") {
      setActiveTab("staff")
      setFilters(prev => ({ ...prev, role: 'STAFF' }))
    } else {
      setActiveTab("students")
      setFilters(prev => ({ ...prev, role: 'STUDENT' }))
    }
  }, [searchParams])

  // Get users data based on current filters
  const { data: usersData, isLoading: isLoadingUsers, error } = useUsers({
    schoolId,
    role: filters.role === 'all' ? undefined : (filters.role as 'STUDENT' | 'TEACHER' | 'STAFF'),
    classId: filters.classId === 'all' ? undefined : filters.classId,
    majorId: filters.majorId === 'all' ? undefined : filters.majorId,
    isActive: filters.isActive === 'all' ? undefined : filters.isActive === 'true',
    search: searchTerm || undefined,
    page: 1,
    limit: 50
  })

  const deleteUserMutation = useDeleteUser()

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
  }

  const handleEditSuccess = () => {
    setEditingUser(null)
  }

  const handleDeleteSuccess = () => {
    toast.success('User berhasil dihapus')
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await deleteUserMutation.mutateAsync({ id: userId })
        handleDeleteSuccess()
      } catch (error) {
        toast.error('Gagal menghapus user')
      }
    }
  }

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Aktif</Badge>
    ) : (
      <Badge variant="destructive">Tidak Aktif</Badge>
    )
  }

  // Toggle filter card and save to localStorage
  const toggleFilterCard = () => {
    const newValue = !showFilterCard
    setShowFilterCard(newValue)
    localStorage.setItem('users-filter-visible', newValue.toString())
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get current users data based on active tab
  const getCurrentUsers = () => {
    if (!usersData?.users) return []
    return usersData.users
  }

    if (isLoadingSchools) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!schoolId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">Tidak dapat memuat data sekolah</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Kelola data siswa, guru, dan staff sekolah</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={showFilterCard ? "default" : "outline"}
            size="sm"
            onClick={toggleFilterCard}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilterCard ? "Sembunyikan Filter" : "Filter"}
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pengguna</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Filter Card - Show/Hide */}
      {showFilterCard && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Lanjutan
              </CardTitle>
              <CardDescription>Filter data pengguna berdasarkan kriteria tertentu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={filters.isActive} onValueChange={(value) => setFilters(prev => ({ ...prev, isActive: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="true">Aktif</SelectItem>
                      <SelectItem value="false">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-filter">Role</Label>
                  <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Role</SelectItem>
                      <SelectItem value="STUDENT">Siswa</SelectItem>
                      <SelectItem value="TEACHER">Guru</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade-filter">Kelas</Label>
                  <Select value={filters.classId} onValueChange={(value) => setFilters(prev => ({ ...prev, classId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      <SelectItem value="10">Kelas 10</SelectItem>
                      <SelectItem value="11">Kelas 11</SelectItem>
                      <SelectItem value="12">Kelas 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setFilters({
                      search: '',
                      role: 'all',
                      isActive: 'all',
                      classId: 'all',
                      majorId: 'all'
                    })
                    setSearchTerm('')
                  }}>
                    Reset
                  </Button>
                  <Button>
                    Terapkan Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Shadcn/ui Tabs dengan URL-based */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="students">Siswa</TabsTrigger>
          <TabsTrigger value="teachers">Guru</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <motion.div
            key="students"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Daftar Siswa
                </CardTitle>
                <CardDescription>Kelola data siswa sekolah</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-600 text-center py-8">Error loading students</div>
                ) : getCurrentUsers().length === 0 ? (
                  <div className="text-center py-12 border rounded-md">
                    <p className="text-muted-foreground mb-4">Belum ada data siswa.</p>
                    <Button onClick={() => { setCreateInitialRole('student'); setShowCreateModal(true) }}>Tambah Siswa</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Major</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentUsers().map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(user.name || 'U')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{user.studentId || '-'}</TableCell>
                          <TableCell>{user.class?.name || '-'}</TableCell>
                          <TableCell>{user.class?.major?.name || '-'}</TableCell>
                          <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingUser(user)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewingUser(user)}>Lihat Detail</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(user.id)}>Hapus</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-6">
          <motion.div
            key="teachers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Daftar Guru
                </CardTitle>
                <CardDescription>Kelola data guru sekolah</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-600 text-center py-8">Error loading teachers</div>
                ) : getCurrentUsers().length === 0 ? (
                  <div className="text-center py-12 border rounded-md">
                    <p className="text-muted-foreground mb-4">Belum ada data guru.</p>
                    <Button onClick={() => { setCreateInitialRole('teacher'); setShowCreateModal(true) }}>Tambah Guru</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Teacher ID</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Subjects</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentUsers().map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(user.name || 'U')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{user.teacherId || '-'}</TableCell>
                          <TableCell>{user.position || '-'}</TableCell>
                          <TableCell>{user.department?.name || '-'}</TableCell>
                          <TableCell>{user.subjects?.map((s: { name: string }) => s.name).join(', ') || '-'}</TableCell>
                          <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingUser(user)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewingUser(user)}>Lihat Detail</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(user.id)}>Hapus</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-6">
          <motion.div
            key="staff"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daftar Staff
                </CardTitle>
                <CardDescription>Kelola data staff sekolah</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-600 text-center py-8">Error loading staff</div>
                ) : getCurrentUsers().length === 0 ? (
                  <div className="text-center py-12 border rounded-md">
                    <p className="text-muted-foreground mb-4">Belum ada data staff.</p>
                    <Button onClick={() => { setCreateInitialRole('staff'); setShowCreateModal(true) }}>Tambah Staff</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Posisi</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentUsers().map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(user.name || 'U')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{user.employeeId || '-'}</TableCell>
                          <TableCell>{user.position || '-'}</TableCell>
                          <TableCell>{user.department?.name || '-'}</TableCell>
                          <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingUser(user)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewingUser(user)}>Lihat Detail</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(user.id)}>Hapus</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateUserModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess}
        schoolId={schoolId}
        initialRole={createInitialRole}
      />

      <EditUserModal
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSuccess={handleEditSuccess}
      />

      <ViewUserModal
        user={viewingUser}
        open={!!viewingUser}
        onOpenChange={(open) => !open && setViewingUser(null)}
      />
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersPageContent />
    </Suspense>
  )
}
