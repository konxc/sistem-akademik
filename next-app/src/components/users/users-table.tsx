'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useUsers, useDeleteUser } from '@/hooks/useUser'
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

interface UsersTableProps {
  filters: {
    search: string
    role: string
    isActive: string
    classId: string
    majorId: string
  }
  schoolId: string
  onEdit: (user: {
    id: string
    name: string
    email: string
    role: string
    isActive: boolean
    [key: string]: unknown
  }) => void
  onView: (user: {
    id: string
    name: string
    email: string
    role: string
    isActive: boolean
    [key: string]: unknown
  }) => void
  onDeleteSuccess: () => void
}

export function UsersTable({ filters, schoolId, onEdit, onView, onDeleteSuccess }: UsersTableProps) {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { data: usersData, isLoading, error } = useUsers({
    schoolId,
    role: filters.role === 'all' ? undefined : (filters.role as 'STUDENT' | 'TEACHER' | 'STAFF' | 'PARENT' | 'ADMIN' | 'SUPER_ADMIN'),
    classId: filters.classId === 'all' ? undefined : filters.classId,
    majorId: filters.majorId === 'all' ? undefined : filters.majorId,
    isActive: filters.isActive === 'all' ? undefined : filters.isActive === 'true',
    search: filters.search || undefined,
    page,
    limit
  })

  const deleteUserMutation = useDeleteUser()

  const handleDelete = async (userId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await deleteUserMutation.mutateAsync({ id: userId })
        onDeleteSuccess()
      } catch (error) {
        toast.error('Gagal menghapus user')
      }
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      STUDENT: { label: 'Student', variant: 'default' as const },
      TEACHER: { label: 'Teacher', variant: 'secondary' as const },
      STAFF: { label: 'Staff', variant: 'outline' as const },
      ADMIN: { label: 'Admin', variant: 'destructive' as const },
      SUPER_ADMIN: { label: 'Super Admin', variant: 'destructive' as const }
    }
    
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: 'outline' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading users: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  const users = usersData?.users || []
  const pagination = usersData?.pagination

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Users</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada users yang ditemukan
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {user.studentId || user.teacherId || user.employeeId || user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.isActive)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-muted-foreground">{user.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {user.role === 'STUDENT' && user.class && (
                            <div className="text-sm">
                              Class: {user.class.name}
                              {user.class.major && (
                                <span className="text-muted-foreground ml-2">
                                  • {user.class.major.name}
                                </span>
                              )}
                            </div>
                          )}
                          {user.role === 'TEACHER' && user.subjects && user.subjects.length > 0 && (
                            <div className="text-sm">
                              Subjects: {user.subjects.map((s: { name: string }) => s.name).join(', ')}
                            </div>
                          )}
                          {user.role === 'STAFF' && user.department && (
                            <div className="text-sm">
                              Department: {user.department.name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    {pagination.totalPages > 5 && (
                      <span className="px-2 text-sm text-muted-foreground">...</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
