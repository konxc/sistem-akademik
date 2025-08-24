'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateUser } from '@/hooks/useUser'
import { useClasses, useMajors as useSchoolMajors, useSubjects, useRombels } from '@/hooks/use-school'
import { useDepartments } from '@/hooks/use-department'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  schoolId: string
  initialRole?: 'student' | 'teacher' | 'staff' | 'admin'
}

export function CreateUserModal({ open, onOpenChange, onSuccess, schoolId, initialRole }: CreateUserModalProps) {
  const [activeTab, setActiveTab] = useState(initialRole ?? 'student')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    isActive: true,
    // Student specific
    studentId: '',
    majorId: '',
    grade: '',
    classId: '',
    rombelId: '',
    enrollmentDate: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
    // Teacher specific
    teacherId: '',
    employeeId: '',
    hireDate: '',
    subjects: [] as string[],
    isHomeroomTeacher: false,
    // Staff specific
    position: '',
    departmentId: '',
    // Admin specific
    permissions: [] as string[]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync initialRole when modal opened
  useEffect(() => {
    if (open && initialRole) {
      setActiveTab(initialRole)
    }
  }, [open, initialRole])
  const [lastError, setLastError] = useState<string | null>(null)

  const createUserMutation = useCreateUser()
  const { data: classes, isLoading: isClassesLoading } = useClasses({
    schoolId,
    majorId: formData.majorId || undefined
  })
  const { data: majors } = useSchoolMajors(schoolId)
  const { data: subjects } = useSubjects(schoolId)
  const { data: rombels } = useRombels(formData.classId)
  const { data: departmentsData, isLoading: isLoadingDepartments } = useDepartments(schoolId, true)

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isFormValid = () => {
    // Basic validation - harus selalu ada
    if (!formData.name || !formData.email) {
      return false
    }

    // Role-specific validation
    switch (activeTab) {
      case 'student':
        const studentValid = !!(formData.studentId && formData.majorId && formData.grade && formData.classId && formData.rombelId && formData.gender)
        return studentValid
      case 'teacher':
        const teacherValid = !!(formData.teacherId && formData.employeeId && formData.position)
        return teacherValid
      case 'staff':
        const staffValid = !!(formData.employeeId && formData.position && formData.departmentId)
        return staffValid
      case 'admin':
        const adminValid = !!formData.password
        return adminValid
      default:
        return false
    }
  }

  // Calculate form completion progress
  const getFormProgress = () => {
    switch (activeTab) {
      case 'student':
        // Field wajib (100% dari progress)
        const studentRequiredFields = ['name', 'email', 'studentId', 'majorId', 'grade', 'classId', 'rombelId', 'gender']
        const filledRequiredFields = studentRequiredFields.filter(field => formData[field as keyof typeof formData])
        const requiredProgress = (filledRequiredFields.length / studentRequiredFields.length) * 80 // 80% untuk field wajib

        // Field opsional (20% dari progress)
        const studentOptionalFields = ['phone', 'address', 'birthDate', 'birthPlace']
        const filledOptionalFields = studentOptionalFields.filter(field => formData[field as keyof typeof formData])
        const optionalProgress = (filledOptionalFields.length / studentOptionalFields.length) * 20 // 20% untuk field opsional

        return Math.round(requiredProgress + optionalProgress)

      case 'teacher':
        // Field wajib (100% dari progress)
        const teacherRequiredFields = ['name', 'email', 'teacherId', 'employeeId', 'hireDate', 'subjects', 'position']
        const filledTeacherRequiredFields = teacherRequiredFields.filter(field => {
          if (field === 'subjects') return formData.subjects.length > 0
          return formData[field as keyof typeof formData]
        })
        const teacherRequiredProgress = (filledTeacherRequiredFields.length / teacherRequiredFields.length) * 80 // 80% untuk field wajib
        
        // Field opsional (20% dari progress)
        const teacherOptionalFields = ['phone', 'address', 'isHomeroomTeacher']
        const filledTeacherOptionalFields = teacherOptionalFields.filter(field => {
          if (field === 'isHomeroomTeacher') return true // Boolean field selalu dihitung
          return formData[field as keyof typeof formData]
        })
        const teacherOptionalProgress = (filledTeacherOptionalFields.length / teacherOptionalFields.length) * 20 // 20% untuk field opsional
        
        return Math.round(teacherRequiredProgress + teacherOptionalProgress)

      case 'staff':
        // Field wajib (100% dari progress)
        const staffRequiredFields = ['name', 'email', 'position', 'departmentId', 'employeeId', 'hireDate']
        const filledStaffRequiredFields = staffRequiredFields.filter(field => formData[field as keyof typeof formData])
        const staffRequiredProgress = (filledStaffRequiredFields.length / staffRequiredFields.length) * 80 // 80% untuk field wajib
        
        // Field opsional (20% dari progress)
        const staffOptionalFields = ['phone', 'address']
        const filledStaffOptionalFields = staffOptionalFields.filter(field => formData[field as keyof typeof formData])
        const staffOptionalProgress = (filledStaffOptionalFields.length / staffOptionalFields.length) * 20 // 20% untuk field opsional
        
        return Math.round(staffRequiredProgress + staffOptionalProgress)

      case 'admin':
        // Field wajib (100% dari progress)
        const adminRequiredFields = ['name', 'email', 'password']
        const filledAdminRequiredFields = adminRequiredFields.filter(field => formData[field as keyof typeof formData])
        const adminRequiredProgress = (filledAdminRequiredFields.length / adminRequiredFields.length) * 80 // 80% untuk field wajib
        
        // Field opsional (20% dari progress)
        const adminOptionalFields = ['phone', 'address', 'employeeId', 'permissions']
        const filledAdminOptionalFields = adminOptionalFields.filter(field => {
          if (field === 'permissions') return formData.permissions.length > 0
          return formData[field as keyof typeof formData]
        })
        const adminOptionalProgress = (filledAdminOptionalFields.length / adminOptionalFields.length) * 20 // 20% untuk field opsional
        
        return Math.round(adminRequiredProgress + adminOptionalProgress)

      default:
        return 0
    }
  }

  const formProgress = getFormProgress()

  // Helper function to check if a field is filled
  const isFieldFilled = (fieldName: keyof typeof formData) => {
    const value = formData[fieldName]
    if (Array.isArray(value)) return value.length > 0
    return value && value !== ''
  }

  // Helper function to get field status class
  const getFieldStatusClass = (fieldName: keyof typeof formData) => {
    const isRequired = ['name', 'email', 'studentId', 'majorId', 'classId', 'gender', 'teacherId', 'employeeId', 'hireDate', 'subjects', 'position', 'departmentId', 'password'].includes(fieldName)

    if (isFieldFilled(fieldName)) {
      return isRequired
        ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500'
        : 'border-blue-300 bg-blue-50 focus:border-blue-500 focus:ring-blue-500'
    }

    return isRequired
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      toast.error('Nama dan email harus diisi')
      return
    }

    // Reset previous error
    setLastError(null)
    setIsSubmitting(true)

    try {
      // Base user data
      const baseData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        isActive: formData.isActive,
        schoolId
      }

      let userData: {
        name: string
        email: string
        phone?: string
        address?: string
        isActive: boolean
        schoolId: string
        role: string
        [key: string]: unknown
      }

      // Create role-specific data based on activeTab
      switch (activeTab) {
        case 'student':
          if (!formData.studentId || !formData.majorId || !formData.grade || !formData.classId || !formData.rombelId || !formData.gender) {
            toast.error('Student ID, Major, Grade, Class, Rombel, dan Gender harus diisi')
            setIsSubmitting(false)
            return
          }
          userData = {
            ...baseData,
            role: 'STUDENT' as const,
            studentId: formData.studentId,
            majorId: formData.majorId,
            grade: parseInt(formData.grade),
            classId: formData.classId,
            rombelId: formData.rombelId,
            enrollmentDate: new Date().toISOString(),
            birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined,
            birthPlace: formData.birthPlace || undefined,
            parentIds: ['temp-parent-id'] // Temporary parent ID to satisfy validation
          }
          break

        case 'teacher':
          if (!formData.teacherId || !formData.employeeId || !formData.position) {
            toast.error('Teacher ID, Employee ID, dan Position harus diisi')
            setIsSubmitting(false)
            return
          }
          if (formData.subjects.length === 0) {
            toast.error('Minimal 1 mata pelajaran harus dipilih')
            setIsSubmitting(false)
            return
          }
          userData = {
            ...baseData,
            role: 'TEACHER' as const,
            teacherId: formData.teacherId,
            employeeId: formData.employeeId,
            hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : new Date().toISOString(),
            subjects: formData.subjects,
            isHomeroomTeacher: formData.isHomeroomTeacher,
            position: formData.position,
            departmentId: formData.departmentId || undefined
          }
          break

        case 'staff':
          if (!formData.employeeId || !formData.position || !formData.departmentId) {
            toast.error('Employee ID, Position, dan Department ID harus diisi')
            setIsSubmitting(false)
            return
          }
          userData = {
            ...baseData,
            role: 'STAFF' as const,
            employeeId: formData.employeeId,
            position: formData.position,
            hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : new Date().toISOString(),
            departmentId: formData.departmentId
          }
          break

        case 'admin':
          if (!formData.password) {
            toast.error('Password harus diisi untuk admin')
            setIsSubmitting(false)
            return
          }
          if (formData.permissions.length === 0) {
            toast.error('Minimal 1 permission harus dipilih')
            setIsSubmitting(false)
            return
          }
          userData = {
            ...baseData,
            role: 'ADMIN' as const,
            password: formData.password,
            employeeId: formData.employeeId || `emp-${Date.now()}`,
            hireDate: new Date().toISOString(),
            permissions: formData.permissions
          }
          break

        default:
          toast.error('Role tidak valid')
          setIsSubmitting(false)
          return
      }

      await createUserMutation.mutateAsync(userData)

      toast.success('User berhasil dibuat')
      onSuccess()
      onOpenChange(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        isActive: true,
        studentId: '',
        majorId: '',
        grade: '',
        classId: '',
        rombelId: '',
        enrollmentDate: '',
        birthDate: '',
        birthPlace: '',
        gender: '',
        teacherId: '',
        employeeId: '',
        hireDate: '',
        subjects: [],
        isHomeroomTeacher: false,
        position: '',
        departmentId: '',
        permissions: []
      })
    } catch (error: any) {
      // Handle specific error types with user-friendly messages
      if (error?.data?.code === 'CONFLICT' || error?.message?.includes('sudah terdaftar')) {
        const errorMsg = 'Email atau ID sudah terdaftar dalam sistem. Silakan gunakan email atau ID yang berbeda.'
        toast.error(errorMsg)
        setLastError(errorMsg)
      } else if (error?.data?.code === 'BAD_REQUEST') {
        const errorMsg = 'Data yang dimasukkan tidak valid. Silakan periksa kembali form Anda.'
        toast.error(errorMsg)
        setLastError(errorMsg)
      } else if (error?.data?.code === 'UNAUTHORIZED') {
        const errorMsg = 'Anda tidak memiliki izin untuk membuat user. Silakan hubungi administrator.'
        toast.error(errorMsg)
        setLastError(errorMsg)
      } else if (error?.data?.code === 'FORBIDDEN') {
        const errorMsg = 'Akses ditolak. Silakan hubungi administrator untuk bantuan.'
        toast.error(errorMsg)
        setLastError(errorMsg)
      } else if (error?.data?.code === 'NOT_FOUND') {
        const errorMsg = 'Data yang diperlukan tidak ditemukan. Silakan refresh halaman dan coba lagi.'
        toast.error(errorMsg)
        setLastError(errorMsg)
      } else if (error?.data?.code === 'INTERNAL_SERVER_ERROR') {
        const errorMsg = 'Terjadi kesalahan pada server. Silakan coba lagi beberapa saat.'
        toast.error(errorMsg)
        setLastError(errorMsg)
      } else {
        // Generic error message
        const errorMsg = 'Gagal membuat user. Silakan coba lagi atau hubungi administrator.'
        toast.error(errorMsg)
        setLastError(errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle>Tambah User Baru</DialogTitle>
          <DialogDescription>
            Pilih role dan isi informasi user yang diperlukan
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="sticky top-0 z-20 p-2">
          <div className="px-4 py-2 rounded-md shadow-md bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${formProgress === 100 ? 'animate-pulse bg-green-100/80' : ''
                  }`}>
                  <div className={`w-4 h-4 rounded-full transition-all duration-300 ${formProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-800 drop-shadow-sm">
                    Progress Pengisian Form
                  </span>
                  <div className="text-xs text-gray-600/90">
                    {(() => {
                      switch (activeTab) {
                        case 'student': return '8 wajib + 4 opsional'
                        case 'teacher': return '7 wajib + 3 opsional'
                        case 'staff': return '6 wajib + 2 opsional'
                        case 'admin': return '3 wajib + 4 opsional'
                        default: return ''
                      }
                    })()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold transition-all duration-300 drop-shadow-sm ${formProgress === 100 ? 'text-green-600' :
                    formProgress >= 75 ? 'text-blue-600' :
                      formProgress >= 50 ? 'text-yellow-600' :
                        formProgress >= 25 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                  {formProgress}%
                </div>
                <div className="text-xs text-gray-500/90">
                  {formProgress === 100 ? '🎉 Lengkap!' :
                    formProgress >= 75 ? '🚀 Hampir selesai' :
                      formProgress >= 50 ? '📈 Setengah jalan' :
                        formProgress >= 25 ? '✨ Mulai mengisi' : '📝 Belum dimulai'}
                </div>
              </div>
            </div>

            <div className="w-full bg-white/40 backdrop-blur-sm rounded-full h-3 shadow-inner overflow-hidden border border-white/50">
              <div
                className={`h-3 rounded-full transition-all duration-700 ease-out shadow-lg relative ${formProgress === 100 ? 'bg-gradient-to-r from-green-400/90 via-green-500/90 to-green-600/90' :
                    formProgress >= 75 ? 'bg-gradient-to-r from-blue-400/90 via-blue-500/90 to-blue-600/90' :
                      formProgress >= 50 ? 'bg-gradient-to-r from-yellow-400/90 via-yellow-500/90 to-yellow-600/90' :
                        formProgress >= 25 ? 'bg-gradient-to-r from-orange-400/90 via-orange-500/90 to-orange-600/90' : 'bg-gradient-to-r from-red-400/90 via-red-500/90 to-red-600/90'
                  }`}
                style={{ width: `${formProgress}%` }}
              >
                {formProgress > 0 && formProgress < 100 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-30 animate-pulse"></div>
                )}
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-full"></div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500/90 mt-2">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-gray-400/80 rounded-full mr-1 shadow-sm"></div>
                Belum lengkap
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500/80 rounded-full mr-1 shadow-sm"></div>
                Lengkap
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className={getFieldStatusClass('name')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Masukkan email"
                  className={getFieldStatusClass('email')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone
                  <span className="text-xs text-blue-600 ml-1">(Opsional)</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Masukkan nomor telepon"
                  className={getFieldStatusClass('phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) => handleInputChange('isActive', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Alamat
                <span className="text-xs text-blue-600 ml-1">(Opsional)</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Masukkan alamat lengkap"
                rows={3}
                className={getFieldStatusClass('address')}
              />
            </div>

            {/* Role Specific Fields */}
            <TabsContent value="student" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    placeholder="Masukkan Student ID"
                    className={getFieldStatusClass('studentId')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                  >
                    <SelectTrigger className={getFieldStatusClass('gender')}>
                      <SelectValue placeholder="Pilih gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="majorId">Major *</Label>
                  <Select
                    value={formData.majorId}
                    onValueChange={(value) => {
                      handleInputChange('majorId', value)
                      // Reset grade, class, dan rombel ketika major berubah
                      handleInputChange('grade', '')
                      handleInputChange('classId', '')
                      handleInputChange('rombelId', '')
                    }}
                  >
                    <SelectTrigger className={getFieldStatusClass('majorId')}>
                      <SelectValue placeholder="Pilih major" />
                    </SelectTrigger>
                    <SelectContent>
                      {majors?.map((major: { id: string; name: string }) => (
                        <SelectItem key={major.id} value={major.id}>
                          {major.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade *</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => {
                      handleInputChange('grade', value)
                      // Reset class dan rombel ketika grade berubah
                      handleInputChange('classId', '')
                      handleInputChange('rombelId', '')
                    }}
                    disabled={!formData.majorId}
                  >
                    <SelectTrigger className={getFieldStatusClass('grade')}>
                      <SelectValue placeholder={formData.majorId ? "Pilih grade" : "Pilih major dulu"} />
                    </SelectTrigger>
                    <SelectContent>
                      {!formData.majorId ? (
                        <SelectItem value="no-major" disabled>Pilih major terlebih dahulu</SelectItem>
                      ) : isClassesLoading ? (
                        <SelectItem value="loading" disabled>Loading grades...</SelectItem>
                      ) : (() => {
                        // Get available grades based on classes for this major
                        if (!classes?.data) return <SelectItem value="no-data" disabled>Tidak ada data kelas</SelectItem>

                        // Filter kelas berdasarkan major yang dipilih
                        const classesForMajor = classes.data.filter((cls: any) =>
                          cls.majorId === formData.majorId
                        )

                        if (classesForMajor.length === 0) {
                          return <SelectItem value="no-classes" disabled>Tidak ada kelas untuk major ini</SelectItem>
                        }

                        // Extract unique grades yang benar-benar ada kelasnya
                        const availableGrades = classesForMajor.reduce((grades: number[], cls: any) => {
                          if (cls.grade && !grades.includes(cls.grade)) {
                            grades.push(cls.grade)
                          }
                          return grades
                        }, [] as number[])

                        if (availableGrades.length === 0) {
                          return <SelectItem value="no-grade-data" disabled>Tidak ada data grade</SelectItem>
                        }

                        // Sort grades dan tampilkan apa adanya dari database
                        return availableGrades.sort((a, b) => a - b).map(grade => (
                          <SelectItem key={grade} value={grade.toString()}>
                            Grade {grade}
                          </SelectItem>
                        ))
                      })()}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classId">Class *</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(value) => {
                      handleInputChange('classId', value)
                      // Reset rombel ketika class berubah
                      handleInputChange('rombelId', '')
                    }}
                    disabled={!formData.grade}
                  >
                    <SelectTrigger className={getFieldStatusClass('classId')}>
                      <SelectValue placeholder={formData.grade ? "Pilih class" : "Pilih grade dulu"} />
                    </SelectTrigger>
                    <SelectContent>
                      {!formData.grade ? (
                        <SelectItem value="no-grade" disabled>Pilih grade terlebih dahulu</SelectItem>
                      ) : isClassesLoading ? (
                        <SelectItem value="loading" disabled>Loading classes...</SelectItem>
                      ) : (() => {
                        if (!classes?.data) return <SelectItem value="no-data" disabled>Tidak ada data kelas</SelectItem>

                        // Filter classes berdasarkan major dan grade
                        const filteredClasses = classes.data.filter((cls: any) =>
                          cls.majorId === formData.majorId &&
                          cls.grade === parseInt(formData.grade)
                        )

                        if (filteredClasses.length === 0) {
                          return <SelectItem value="no-classes" disabled>Tidak ada class untuk grade ini</SelectItem>
                        }

                        return filteredClasses.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rombelId">Rombel *</Label>
                  <Select
                    value={formData.rombelId}
                    onValueChange={(value) => handleInputChange('rombelId', value)}
                    disabled={!formData.classId}
                  >
                    <SelectTrigger className={getFieldStatusClass('rombelId')}>
                      <SelectValue placeholder={formData.classId ? "Pilih rombel" : "Pilih class dulu"} />
                    </SelectTrigger>
                    <SelectContent>
                      {rombels?.filter(rombel =>
                        rombel.classId === formData.classId
                      ).map((rombel: { id: string; name: string }) => (
                        <SelectItem key={rombel.id} value={rombel.id}>
                          {rombel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    Tanggal Lahir
                    <span className="text-xs text-blue-600 ml-1">(Opsional)</span>
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={getFieldStatusClass('birthDate')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthPlace">
                  Tempat Lahir
                  <span className="text-xs text-blue-600 ml-1">(Opsional)</span>
                </Label>
                <Input
                  id="birthPlace"
                  value={formData.birthPlace}
                  onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                  placeholder="Masukkan tempat lahir"
                  className={getFieldStatusClass('birthPlace')}
                />
              </div>
            </TabsContent>

            <TabsContent value="teacher" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherId">Teacher ID *</Label>
                  <Input
                    id="teacherId"
                    value={formData.teacherId}
                    onChange={(e) => handleInputChange('teacherId', e.target.value)}
                    placeholder="Masukkan Teacher ID"
                    className={getFieldStatusClass('teacherId')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    placeholder="Masukkan Employee ID"
                    className={getFieldStatusClass('employeeId')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hireDate">Tanggal Hire</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleInputChange('hireDate', e.target.value)}
                    className={getFieldStatusClass('hireDate')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="misal: Guru Matematika"
                    className={getFieldStatusClass('position')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isHomeroomTeacher">Homeroom Teacher</Label>
                  <Select
                    value={formData.isHomeroomTeacher.toString()}
                    onValueChange={(value) => handleInputChange('isHomeroomTeacher', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optional Department for Teacher */}
              <div className="space-y-2">
                <Label htmlFor="teacherDepartment">Department (Opsional)</Label>
                <Select
                  value={formData.departmentId || 'none'}
                  onValueChange={(value) => handleInputChange('departmentId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingDepartments ? 'Loading departments...' : 'Pilih department (opsional)'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa department</SelectItem>
                    {departmentsData?.map((dept: any) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects</Label>
                <Select
                  value="add-subject"
                  onValueChange={(value) => {
                    if (value && value !== "add-subject" && !formData.subjects.includes(value)) {
                      handleInputChange('subjects', [...formData.subjects, value])
                    }
                  }}
                >
                  <SelectTrigger className={getFieldStatusClass('subjects')}>
                    <SelectValue placeholder="Pilih subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add-subject" disabled>Pilih subject</SelectItem>
                    {subjects?.data?.map((subject: { id: string; name: string }) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.subjects.map((subjectId) => {
                      const subject = subjects?.data?.find((s: { id: string }) => s.id === subjectId)
                      return (
                        <Badge
                          key={subjectId}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleInputChange('subjects', formData.subjects.filter(id => id !== subjectId))}
                        >
                          {subject?.name} ×
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="staff" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    placeholder="Masukkan Employee ID"
                    className={getFieldStatusClass('employeeId')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="misal: Guru Matematika"
                    className={getFieldStatusClass('position')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departmentId">Department *</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => handleInputChange('departmentId', value)}
                  >
                    <SelectTrigger className={getFieldStatusClass('departmentId')}>
                      <SelectValue placeholder={isLoadingDepartments ? 'Loading departments...' : 'Pilih department'} />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentsData?.map((dept: any) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hireDate">Tanggal Hire</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleInputChange('hireDate', e.target.value)}
                    className={getFieldStatusClass('hireDate')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmployeeId">Employee ID</Label>
                  <Input
                    id="adminEmployeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    placeholder="Masukkan Employee ID (opsional)"
                    className={getFieldStatusClass('employeeId')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Masukkan password"
                  className={getFieldStatusClass('password')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permissions">Permissions</Label>
                <div className="space-y-2">
                  {['users', 'classes', 'subjects', 'reports', 'settings'].map((permission) => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange('permissions', [...formData.permissions, permission])
                          } else {
                            handleInputChange('permissions', formData.permissions.filter(p => p !== permission))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Membuat...
                  </>
                ) : (
                  'Buat User'
                )}
              </Button>
            </div>

            {/* Error Message Display */}
            {lastError && (
              <div className="sticky bottom-2 z-20 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div className="text-sm text-red-700">
                    <strong>Error:</strong> {lastError}
                  </div>
                </div>
                <button
                  onClick={() => setLastError(null)}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Tutup pesan error
                </button>
              </div>
            )}

            {/* Debug Info */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <div className="font-semibold mb-2">Debug Info:</div>
                <div>Active Tab: {activeTab}</div>
                <div>Form Valid: {isFormValid() ? '✅' : '❌'}</div>
                <div>Name: {formData.name || 'empty'}</div>
                <div>Email: {formData.email || 'empty'}</div>
                {activeTab === 'student' && (
                  <>
                    <div>Student ID: {formData.studentId || 'empty'}</div>
                    <div>Major ID: {formData.majorId || 'empty'}</div>
                    <div>Grade: {formData.grade || 'empty'}</div>
                    <div>Class ID: {formData.classId || 'empty'}</div>
                    <div>Rombel ID: {formData.rombelId || 'empty'}</div>
                    <div>Gender: {formData.gender || 'empty'}</div>
                    <div>Birth Date: {formData.birthDate || 'empty'}</div>
                    <div>Birth Place: {formData.birthPlace || 'empty'}</div>
                  </>
                )}
                <div>Mutation Pending: {createUserMutation.isPending ? 'Yes' : 'No'}</div>
              </div>
            )} */}
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  )
}
