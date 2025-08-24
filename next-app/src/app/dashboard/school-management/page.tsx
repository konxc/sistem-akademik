'use client'

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Building, 
  Users, 
  GraduationCap, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Shield
} from "lucide-react"
import { withAdminAuth } from "@/components/auth/with-auth"
import { useSchools, useUpdateSchool, useAcademicYears, useMajors, useDeleteAcademicYear, useDeleteMajor, useClasses, useDeleteClass, useCreateAcademicYear, useUpdateAcademicYear, useCreateMajor, useUpdateMajor, useCreateClass, useUpdateClass } from "@/hooks/use-school"
import { useDepartments, useDeleteDepartment } from "@/hooks/use-department"
import { toast } from "sonner"
import { AcademicYearModal } from "@/components/school/academic-year-modal"
import { MajorModal } from "@/components/school/major-modal"
import { ClassModal } from "@/components/school/class-modal"
import { RombelModal } from "@/components/school/rombel-modal"
import { DepartmentModal } from "@/components/school/department-modal"

function SchoolManagementPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Get active tab from URL query parameter
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'overview'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    foundedYear: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    accreditation: ""
  })

  // Modal states
  const [academicYearModal, setAcademicYearModal] = useState({
    isOpen: false,
    mode: 'create' as 'create' | 'edit',
    data: null as any
  })

  const [majorModal, setMajorModal] = useState({
    isOpen: false,
    mode: 'create' as 'create' | 'edit',
    data: null as any
  })

  const [classModal, setClassModal] = useState({
    isOpen: false,
    mode: 'create' as 'create' | 'edit',
    data: null as any
  })

  const [rombelModal, setRombelModal] = useState({
    isOpen: false,
    mode: 'create' as 'create' | 'edit',
    data: null as any,
    classId: '',
    className: ''
  })

  const [departmentModal, setDepartmentModal] = useState({
    isOpen: false,
    mode: 'create' as 'create' | 'edit',
    data: null as any
  })

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    
    // Auto-exit edit mode when switching tabs
    if (isEditing) {
      setIsEditing(false)
    }
    
    const params = new URLSearchParams(searchParams)
    params.set('tab', tabId)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Sync with URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview'
    setActiveTab(tab)
  }, [searchParams])

  // Auto-exit edit mode when switching away from overview tab
  useEffect(() => {
    if (activeTab !== 'overview' && isEditing) {
      setIsEditing(false)
    }
  }, [activeTab, isEditing])

  // Handle Edit Button Click - Auto switch to Overview tab if needed
  const handleEditClick = () => {
    // If not in overview tab, switch to it first
    if (activeTab !== 'overview') {
      handleTabChange('overview')
      
      // Then enable edit mode after a short delay to ensure tab switch is complete
      setTimeout(() => {
        setIsEditing(true)
      }, 100)
    } else {
      // If already in overview tab, just enable edit mode
      setIsEditing(true)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle form save
  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      if (!schoolData.id) {
        toast.error('School ID tidak ditemukan')
        return
      }

      // Prepare data for API call
      const updateData = {
        name: formData.name,
        foundedYear: parseInt(formData.foundedYear) || 1995,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        accreditation: formData.accreditation
      }

      // Call tRPC update mutation
      await updateSchoolMutation.mutateAsync({
        id: schoolData.id,
        data: updateData
      })
      
      // Toast ditangani oleh hook useUpdateSchool
      
      // Exit edit mode
      setIsEditing(false)
      
    } catch (error: any) {
      console.error('Error saving data:', error)
      // Error toast ditangani oleh hook useUpdateSchool
    } finally {
      setIsSaving(false)
    }
  }

  // Handle form cancel
  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: schoolData.name || "",
      foundedYear: schoolData.foundedYear?.toString() || "",
      address: schoolData.address || "",
      phone: schoolData.phone || "",
      email: schoolData.email || "",
      website: schoolData.website || "",
      accreditation: schoolData.accreditation || ""
    })
    
    // Exit edit mode
    setIsEditing(false)
  }

  // Handle Academic Year Modal
  const handleAcademicYearModal = (mode: 'create' | 'edit', data?: any) => {
    setAcademicYearModal({
      isOpen: true,
      mode,
      data
    })
  }

  const closeAcademicYearModal = () => {
    setAcademicYearModal({
      isOpen: false,
      mode: 'create',
      data: null
    })
  }

  // Handle Major Modal
  const handleMajorModal = (mode: 'create' | 'edit', data?: any) => {
    setMajorModal({
      isOpen: true,
      mode,
      data
    })
  }

  const closeMajorModal = () => {
    setMajorModal({
      isOpen: false,
      mode: 'create',
      data: null
    })
  }

  // Handle Department Modal
  const handleDepartmentModal = (mode: 'create' | 'edit', data?: any) => {
    setDepartmentModal({
      isOpen: true,
      mode,
      data
    })
  }

  const closeDepartmentModal = () => {
    setDepartmentModal({
      isOpen: false,
      mode: 'create',
      data: null
    })
  }

  const handleClassModal = (mode: 'create' | 'edit', data?: any) => {
    setClassModal({
      isOpen: true,
      mode,
      data: data || null
    })
  }

  const closeClassModal = () => {
    setClassModal({
      isOpen: false,
      mode: 'create',
      data: null
    })
  }

  const handleRombelModal = (mode: 'create' | 'edit', classId: string, className: string, data?: any) => {
    setRombelModal({
      isOpen: true,
      mode,
      data: data || null,
      classId,
      className
    })
  }

  const closeRombelModal = () => {
    setRombelModal({
      isOpen: false,
      mode: 'create',
      data: null,
      classId: '',
      className: ''
    })
  }

  // Handle Delete Operations
  const handleDeleteAcademicYear = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tahun ajaran ini?')) {
      try {
        await deleteAcademicYearMutation.mutateAsync(id)
      } catch (error: any) {
        // Error toast ditangani di hook useDeleteAcademicYear
      }
    }
  }

  const handleDeleteMajor = async (id: string) => {
    // Find the major to check its name
    const majorToDelete = majorsData?.find(major => major.id === id)
    
    // Prevent deletion of "Umum" major
    if (majorToDelete?.name === 'Umum') {
      toast.error('Jurusan "Umum" tidak dapat dihapus karena berisi mata pelajaran wajib')
      return
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus jurusan ini?')) {
      try {
        await deleteMajorMutation.mutateAsync(id)
      } catch (error: any) {
        // Error toast ditangani di hook useDeleteMajor
      }
    }
  }

  const handleDeleteClass = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      try {
        await deleteClassMutation.mutateAsync(id)
      } catch (error: any) {
        // Error toast ditangani di hook useDeleteClass
      }
    }
  }

  const handleDeleteDepartment = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus departemen ini?')) {
      try {
        await deleteDepartmentMutation.mutateAsync({ id })
      } catch (error: any) {
        // Error toast ditangani di hook useDeleteDepartment
      }
    }
  }

  // Fetch real school data using tRPC
  const { data: schoolsData, isLoading: isLoadingSchools } = useSchools({ page: 1, limit: 1 })
  const updateSchoolMutation = useUpdateSchool()

  // ✅ PERBAIKAN: Gunakan useMemo untuk mencegah object baru setiap render
  const schoolData = useMemo(() => {
    const apiData = schoolsData?.data?.[0]
    if (apiData) {
      return apiData
    }
    
    // Return default data only if no API data
    return {
      id: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      foundedYear: 1995,
      accreditation: "",
      totalStudents: 0,
      totalTeachers: 0,
      totalStaff: 0,
      totalClasses: 0
    }
  }, [schoolsData?.data])

  // ✅ PERBAIKAN: useEffect dengan dependency yang stabil
  useEffect(() => {
    if (schoolData && (schoolData.name || schoolData.foundedYear || schoolData.address)) {
      setFormData({
        name: schoolData.name || "",
        foundedYear: schoolData.foundedYear?.toString() || "",
        address: schoolData.address || "",
        phone: schoolData.phone || "",
        email: schoolData.email || "",
        website: schoolData.website || "",
        accreditation: schoolData.accreditation || ""
      })
    }
  }, [schoolData.name, schoolData.foundedYear, schoolData.address, schoolData.phone, schoolData.email, schoolData.website, schoolData.accreditation])

  // Fetch academic years data
  const { data: academicYearsData, isLoading: isLoadingAcademicYears } = useAcademicYears(schoolData.id)
  const createAcademicYearMutation = useCreateAcademicYear()
  const updateAcademicYearMutation = useUpdateAcademicYear()
  const deleteAcademicYearMutation = useDeleteAcademicYear()

  // Fetch majors data
  const { data: majorsData, isLoading: isLoadingMajors } = useMajors(schoolData.id)
  const createMajorMutation = useCreateMajor()
  const updateMajorMutation = useUpdateMajor()
  const deleteMajorMutation = useDeleteMajor()

  // Fetch classes data
  const { data: classesData, isLoading: isLoadingClasses } = useClasses({ 
    page: 1, 
    limit: 50,
    schoolId: schoolData.id,
    isActive: true
  })
  const createClassMutation = useCreateClass()
  const updateClassMutation = useUpdateClass()
  const deleteClassMutation = useDeleteClass()

  // Data struktur organisasi
  const organizationalStructure = [
    {
      position: "Kepala Sekolah",
      name: "Drs. Ahmad Rizki, M.Pd",
      email: "kepsek@smauiiyk.sch.id",
      phone: "0274-895123",
      department: "Manajemen"
    },
    {
      position: "Wakil Kepala Sekolah",
      name: "Dra. Siti Aminah, M.Pd",
      email: "wakasek@smauiiyk.sch.id",
      phone: "0274-895124",
      department: "Akademik"
    },
    {
      position: "Kepala TU",
      name: "Budi Santoso, S.Pd",
      email: "katu@smauiiyk.sch.id",
      phone: "0274-895125",
      department: "Administrasi"
    },
    {
      position: "Kepala Perpustakaan",
      name: "Rina Sari, S.Pd",
      email: "kapus@smauiiyk.sch.id",
      phone: "0274-895126",
      department: "Perpustakaan"
    }
  ]

  // Get departments data from tRPC
  const { data: departmentsData, isLoading: isLoadingDepartments } = useDepartments(schoolData?.id || '', true)
  const deleteDepartmentMutation = useDeleteDepartment()

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'academic', label: 'Akademik' },
    { id: 'organization', label: 'Organisasi' },
    { id: 'streams', label: 'Jurusan' }
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Sekolah</h1>
          <p className="text-muted-foreground">Pengaturan dan konfigurasi sekolah</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Globe className="h-4 w-4 mr-2" />
            Website
          </Button>
          <Button size="sm" onClick={isEditing ? () => setIsEditing(false) : handleEditClick}>
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Batal
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Tab Navigation with Animation */}
      <div className="space-y-6">
        <div className="relative">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  relative flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-500 ease-out
                  ${activeTab === tab.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }
                `}
                title={tab.id === 'overview' ? 'Edit mode tersedia di tab ini' : 'Edit mode tidak tersedia di tab ini'}
              >
                {/* Active Tab Background */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-background rounded-md shadow-sm border border-border"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 40,
                      mass: 1.2
                    }}
                  />
                )}
                
                {/* Tab Label */}
                <span className="relative z-10">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
          
          {/* Floating Active Indicator */}
          <motion.div
            layoutId="floatingIndicator"
            className="absolute top-1 bottom-1 bg-primary/10 border border-primary/20 rounded-md"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 35,
              mass: 1.5
            }}
            style={{
              width: `${100 / tabs.length}%`,
              left: `${tabs.findIndex(tab => tab.id === activeTab) * (100 / tabs.length)}%`
            }}
          />
          
          
        </div>
      </div>

      {/* Tab Content with Animation */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isLoadingSchools ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading data sekolah...</p>
                </div>
              </div>
            ) : (
              <>
          {/* School Information Card */}
                <Card className={isEditing ? "ring-2 ring-primary/20 border-primary/30" : ""}>
            <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informasi Sekolah
                          {isEditing && (
                            <Badge variant="secondary" className="ml-2">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Mode
                            </Badge>
                          )}
              </CardTitle>
                        <CardDescription>
                          {isEditing ? "Edit data dasar sekolah" : "Data dasar sekolah"}
                        </CardDescription>
                      </div>
                    </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">Nama Sekolah</Label>
                  <Input 
                    id="schoolName" 
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                          autoFocus={isEditing}
                          className={isEditing ? "ring-2 ring-primary/20" : ""}
                  />
                </div>
                <div className="space-y-2">
                        <Label htmlFor="foundedYear">Tahun Berdiri</Label>
                  <Input 
                          id="foundedYear" 
                          value={formData.foundedYear}
                          onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolAddress">Alamat</Label>
                <Input 
                  id="schoolAddress" 
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolPhone">Telepon</Label>
                  <Input 
                    id="schoolPhone" 
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">Email</Label>
                  <Input 
                    id="schoolEmail" 
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolWebsite">Website</Label>
                  <Input 
                    id="schoolWebsite" 
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accreditation">Akreditasi</Label>
                  <Input 
                    id="accreditation" 
                          value={formData.accreditation}
                          onChange={(e) => handleInputChange('accreditation', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
                    
                    {/* Tombol Save dan Cancel */}
              {isEditing && (
                      <div className="flex space-x-2 pt-4 border-t">
                        <Button 
                          size="sm" 
                          onClick={handleSave}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Menyimpan...
                            </>
                          ) : (
                            <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                            </>
                          )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schoolData.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Aktif tahun ajaran ini
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schoolData.totalTeachers}</div>
                <p className="text-xs text-muted-foreground">
                  Guru tetap dan honorer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schoolData.totalClasses}</div>
                <p className="text-xs text-muted-foreground">
                  Kelas aktif
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schoolData.totalStaff}</div>
                <p className="text-xs text-muted-foreground">
                  Staff administrasi
                </p>
              </CardContent>
            </Card>
          </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === "academic" && (
          <motion.div
            key="academic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
          {/* Academic Year Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tahun Ajaran
              </CardTitle>
              <CardDescription>Manajemen tahun ajaran aktif</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Tahun Ajaran Aktif</h4>
                  <Button 
                    size="sm" 
                    onClick={() => handleAcademicYearModal('create')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Tahun Ajaran
                  </Button>
                </div>
                
                {isLoadingAcademicYears ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : academicYearsData && academicYearsData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tahun Ajaran</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {academicYearsData.map((year) => (
                        <TableRow key={year.id}>
                          <TableCell className="font-medium">{year.name}</TableCell>
                          <TableCell>
                            {new Date(year.startDate).toLocaleDateString('id-ID')} - {new Date(year.endDate).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={year.isActive ? "default" : "secondary"}>
                              {year.isActive ? "Aktif" : "Tidak Aktif"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAcademicYearModal('edit', year)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteAcademicYear(year.id)}
                                disabled={deleteAcademicYearMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada tahun ajaran yang dibuat
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Class and Rombel Management */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Kelas dan Rombongan Belajar
              </CardTitle>
              <CardDescription>Manajemen kelas dan rombongan belajar berdasarkan jenjang sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* School Level Information */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Informasi Jenjang Sekolah</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="font-medium text-primary">SD</p>
                      <p className="text-muted-foreground">Kelas 1-6</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-primary">SMP</p>
                      <p className="text-muted-foreground">Kelas 7-9</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-primary">SMA/SMK</p>
                      <p className="text-muted-foreground">Kelas 10-12</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-primary">Hybrid</p>
                      <p className="text-muted-foreground">SMP-SMA/SMK</p>
                    </div>
                  </div>
                </div>

                {/* Class Management */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Manajemen Kelas</h4>
                    <Button 
                      size="sm" 
                      onClick={() => handleClassModal('create')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Kelas
                    </Button>
                  </div>
                  
                  {isLoadingClasses ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  ) : classesData && classesData.data && classesData.data.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {classesData.data.map((classItem: any) => (
                        <Card key={classItem.id} className="p-4">
                          <CardHeader className="p-0 pb-4">
                            <CardTitle className="text-lg">{classItem.name || 'Kelas Tanpa Nama'}</CardTitle>
                            <CardDescription className="text-sm">
                              Grade {classItem.grade} • Kapasitas: {classItem.capacity}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-0 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {classItem.major?.name || 'Umum'}
                              </Badge>
                              <Badge variant={classItem.isActive ? "default" : "secondary"} className="text-xs">
                                {classItem.isActive ? "Aktif" : "Tidak Aktif"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Siswa: {classItem.currentStudents || 0}/{classItem.capacity || 0}
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleClassModal('edit', classItem)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRombelModal('create', classItem.id, classItem.name || 'Kelas Tanpa Nama')}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Rombel
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteClass(classItem.id)}
                                disabled={deleteClassMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Belum ada kelas yang dibuat
                    </div>
                  )}
                </div>

                {/* Rombongan Belajar Management */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Rombongan Belajar</h4>
                    <div className="text-sm text-muted-foreground">
                      Klik tombol "Rombel" pada setiap kelas untuk mengelola rombongan belajar
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      Rombongan belajar memungkinkan pengelompokan siswa dalam satu kelas menjadi beberapa kelompok (A, B, C, D, dst.)
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Setiap kelas dapat memiliki rombel A-Z dengan kapasitas yang dapat diatur</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                        <span>Rombel dapat dibuat, diedit, dan dihapus sesuai kebutuhan</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>Setiap rombel memiliki kapasitas maksimal dan jumlah siswa aktif</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        )}

        {activeTab === "organization" && (
          <motion.div
            key="organization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
          {/* Organizational Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Struktur Organisasi
              </CardTitle>
              <CardDescription>Jabatan dan struktur kepemimpinan sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Jabatan Kepemimpinan</h4>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Jabatan
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Departemen</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizationalStructure.map((position, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{position.position}</TableCell>
                        <TableCell>{position.name}</TableCell>
                        <TableCell>{position.email}</TableCell>
                        <TableCell>{position.phone}</TableCell>
                        <TableCell>{position.department}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Department Management */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-4" />
                Departemen
              </CardTitle>
              <CardDescription>Kelola departemen sekolah untuk staff dan guru</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Daftar Departemen</h4>
                  <Button 
                    size="sm"
                    onClick={() => handleDepartmentModal('create')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Departemen
                  </Button>
                </div>
                
                {isLoadingDepartments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : departmentsData && departmentsData.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {departmentsData.map((dept, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{dept.name}</CardTitle>
                          <Badge variant={dept.isActive ? "default" : "secondary"}>
                            {dept.isActive ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Staff:</span>
                            <span className="font-medium">{dept.staffCount} orang</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Guru:</span>
                            <span className="font-medium">{dept.teacherCount} orang</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDepartmentModal('edit', dept)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDeleteDepartment(dept.id)}
                            disabled={deleteDepartmentMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada departemen yang dibuat
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </motion.div>
        )}

        {activeTab === "streams" && (
          <motion.div
            key="streams"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
          {/* Academic Streams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Jurusan/Program Studi
              </CardTitle>
              <CardDescription>Manajemen jurusan dan program studi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Daftar Jurusan</h4>
                  <Button 
                    size="sm"
                    onClick={() => handleMajorModal('create')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Jurusan
                  </Button>
                </div>
                
                {/* Info about protected majors */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Shield className="h-4 w-4" />
                    <p className="text-sm font-medium">Jurusan Terlindungi</p>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Jurusan "Umum" tidak dapat dihapus karena berisi mata pelajaran wajib yang diperlukan untuk semua siswa.
                  </p>
                </div>
                
                {isLoadingMajors ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : majorsData && majorsData.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {majorsData.map((major) => (
                      <Card key={major.id} className="p-4">
                        <CardHeader className="p-0 pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{major.name}</CardTitle>
                            {major.name === 'Umum' && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Protected
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">
                            {major.description || 'Tidak ada deskripsi'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {major.code}
                            </Badge>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleMajorModal('edit', major)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteMajor(major.id)}
                              disabled={deleteMajorMutation.isPending || major.name === 'Umum'}
                              title={major.name === 'Umum' ? 'Jurusan "Umum" tidak dapat dihapus karena berisi mata pelajaran wajib' : 'Hapus jurusan'}
                              className={major.name === 'Umum' ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada jurusan yang dibuat
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Academic Year Modal */}
      <AcademicYearModal
        isOpen={academicYearModal.isOpen}
        onClose={closeAcademicYearModal}
        schoolId={schoolData.id}
        academicYear={academicYearModal.data}
        mode={academicYearModal.mode}
      />

      {/* Major Modal */}
      <MajorModal
        isOpen={majorModal.isOpen}
        onClose={closeMajorModal}
        schoolId={schoolData.id}
        major={majorModal.data}
        mode={majorModal.mode}
      />

      {/* Class Modal */}
      <ClassModal
        isOpen={classModal.isOpen}
        onClose={closeClassModal}
        schoolId={schoolData.id}
        academicYearId={academicYearsData?.[0]?.id || ''}
        majors={majorsData || []}
        classData={classModal.data}
        mode={classModal.mode}
      />

      {/* Rombel Modal */}
      <RombelModal
        isOpen={rombelModal.isOpen}
        onClose={closeRombelModal}
        schoolId={schoolData.id}
        classId={rombelModal.classId}
        className={rombelModal.className}
        mode={rombelModal.mode}
      />

      {/* Department Modal */}
      <DepartmentModal
        isOpen={departmentModal.isOpen}
        onClose={closeDepartmentModal}
        department={departmentModal.data}
        mode={departmentModal.mode}
        schoolId={schoolData.id}
      />
    </div>
  )
}

export default withAdminAuth(SchoolManagementPage)
