'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, Mail, Phone, MapPin, User, Building, GraduationCap, Briefcase } from 'lucide-react'

interface ViewUserModalProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewUserModal({ user, open, onOpenChange }: ViewUserModalProps) {
  if (!user) return null

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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.isActive)}
              </div>
              <p className="text-muted-foreground mt-1">
                ID: {user.studentId || user.teacherId || user.employeeId || user.id}
              </p>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Dasar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Address:</span>
                    <span className="text-sm">{user.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role Specific Information */}
          {user.role === 'STUDENT' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Informasi Student
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Class:</span>
                    <span className="text-sm">{user.class?.name || 'N/A'}</span>
                  </div>
                  {user.class?.major && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Major:</span>
                      <span className="text-sm">{user.class.major.name}</span>
                    </div>
                  )}
                  {user.enrollmentDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Enrollment Date:</span>
                      <span className="text-sm">{formatDate(user.enrollmentDate)}</span>
                    </div>
                  )}
                  {user.dateOfBirth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Date of Birth:</span>
                      <span className="text-sm">{formatDate(user.dateOfBirth)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'TEACHER' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informasi Teacher
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {user.hireDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Hire Date:</span>
                      <span className="text-sm">{formatDate(user.hireDate)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Homeroom Teacher:</span>
                    <span className="text-sm">{user.isHomeroomTeacher ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                {user.subjects && user.subjects.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Subjects:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.subjects.map((subject: any) => (
                        <Badge key={subject.id} variant="outline">
                          {subject.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {user.role === 'STAFF' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informasi Staff
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Position:</span>
                    <span className="text-sm">{user.position || 'N/A'}</span>
                  </div>
                  {user.department && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Department:</span>
                      <span className="text-sm">{user.department.name}</span>
                    </div>
                  )}
                  {user.hireDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Hire Date:</span>
                      <span className="text-sm">{formatDate(user.hireDate)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
          </Card>
          )}

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-sm">{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
