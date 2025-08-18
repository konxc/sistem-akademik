'use client'

import { useState, useEffect } from "react"
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
  X
} from "lucide-react"
import { withAdminAuth } from "@/components/auth/with-auth"
import { useSchools, useUpdateSchool } from "@/hooks/use-school"
import { toast } from "sonner"

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

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const params = new URLSearchParams(searchParams)
    params.set('tab', tabId)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle Edit Button Click - Auto switch to Overview tab
  const handleEditClick = () => {
    // Switch to overview tab first
    handleTabChange('overview')
    
    // Then enable edit mode after a short delay to ensure tab switch is complete
    setTimeout(() => {
      setIsEditing(true)
    }, 100)
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
      
      // Show success message
      toast.success('Data sekolah berhasil disimpan!')
      
      // Exit edit mode
      setIsEditing(false)
      
    } catch (error: any) {
      console.error('Error saving data:', error)
      toast.error(`Gagal menyimpan data: ${error.message || 'Unknown error'}`)
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

  // Sync with URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview'
    setActiveTab(tab)
  }, [searchParams])



  // Fetch real school data using tRPC
  const { data: schoolsData, isLoading: isLoadingSchools } = useSchools({ page: 1, limit: 1 })
  const updateSchoolMutation = useUpdateSchool()

  // Get school data from API response
  const schoolData = schoolsData?.data?.[0] || {
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

  // Data tahun ajaran
  const academicYears = [
    {
      id: "2024-2025",
      name: "Tahun Ajaran 2024/2025",
      startDate: "2024-07-15",
      endDate: "2025-06-30",
      status: "active",
      semester: "Semester 1"
    },
    {
      id: "2023-2024",
      name: "Tahun Ajaran 2023/2024",
      startDate: "2023-07-15",
      endDate: "2024-06-30",
      status: "completed",
      semester: "Semester 2"
    }
  ]

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

  // Data jurusan/stream
  const streams = [
    {
      id: "ipa",
      name: "Ilmu Pengetahuan Alam (IPA)",
      description: "Jurusan untuk siswa yang ingin melanjutkan ke perguruan tinggi bidang sains dan teknologi",
      totalStudents: 456,
      totalClasses: 12,
      subjects: ["Matematika", "Fisika", "Kimia", "Biologi"]
    },
    {
      id: "ips",
      name: "Ilmu Pengetahuan Sosial (IPS)",
      description: "Jurusan untuk siswa yang ingin melanjutkan ke perguruan tinggi bidang sosial dan ekonomi",
      totalStudents: 398,
      totalClasses: 11,
      subjects: ["Ekonomi", "Sejarah", "Geografi", "Sosiologi"]
    },
    {
      id: "bahasa",
      name: "Bahasa dan Budaya",
      description: "Jurusan untuk siswa yang ingin melanjutkan ke perguruan tinggi bidang bahasa dan budaya",
      totalStudents: 193,
      totalClasses: 5,
      subjects: ["Bahasa Indonesia", "Bahasa Inggris", "Bahasa Arab", "Sastra"]
    }
  ]

  // Initialize form data when school data changes
  useEffect(() => {
    setFormData({
      name: schoolData.name || "",
      foundedYear: schoolData.foundedYear?.toString() || "",
      address: schoolData.address || "",
      phone: schoolData.phone || "",
      email: schoolData.email || "",
      website: schoolData.website || "",
      accreditation: schoolData.accreditation || ""
    })
  }, [schoolData])

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
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Tahun Ajaran
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tahun Ajaran</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {academicYears.map((year) => (
                        <TableRow key={year.id}>
                          <TableCell className="font-medium">{year.name}</TableCell>
                          <TableCell>{year.startDate} - {year.endDate}</TableCell>
                          <TableCell>
                            <Badge variant={year.status === "active" ? "default" : "secondary"}>
                              {year.status === "active" ? "Aktif" : "Selesai"}
                            </Badge>
                          </TableCell>
                          <TableCell>{year.semester}</TableCell>
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
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Jurusan
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {streams.map((stream) => (
                      <Card key={stream.id} className="p-4">
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="text-lg">{stream.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {stream.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Siswa:</span>
                              <p className="font-medium">{stream.totalStudents}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Kelas:</span>
                              <p className="font-medium">{stream.totalClasses}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Mata Pelajaran:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {stream.subjects.map((subject, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default withAdminAuth(SchoolManagementPage)
