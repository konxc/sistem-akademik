"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Plus,
  Search,
  Filter,
  Save,
  X
} from "lucide-react"
import { SubjectFormModal } from "@/components/subjects/subject-form-modal"
import { SubjectCard } from "@/components/subjects/subject-card"
import { SubjectsTable } from "@/components/subjects/subjects-table"
import { useSubjectsByMajor, useMajors, useDeleteSubject, useCreateSubject } from "@/hooks/use-school"
import { toast } from "sonner"

interface SubjectData {
  id: string
  name: string
  code: string
  description?: string | null
  credits: number
  majorId?: string | null
  major?: {
    name: string
  } | null
  teachers?: Array<{
    name: string
  }> | null
  isActive: boolean
}

interface MajorData {
  id: string
  name: string
  code: string
  description?: string | null
  subjects?: SubjectData[]
}

interface SubjectsData {
  majors: MajorData[]
}

export default function SubjectPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null)
  const [formData, setFormData] = useState<SubjectData>({
    id: "",
    name: "",
    code: "",
    description: "",
    credits: 1,
    majorId: "umum", // Default to "umum" (general subjects)
    isActive: true,
  })
  
  // TODO: Get schoolId from database or context
  // For now, using hardcoded value - this should be replaced with actual school context
  const schoolId = 'cmeeixcl10000kzf3nyw2lqqs' // Gunakan ID sekolah yang sebenarnya dari database
  
  // Fetch data
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjectsByMajor(schoolId)
  const { data: majorsData, isLoading: isLoadingMajors } = useMajors(schoolId)
  const deleteSubjectMutation = useDeleteSubject()
  const createSubjectMutation = useCreateSubject()

  // Debug: Log data yang diterima
  console.log('subjectsData:', subjectsData)
  console.log('majorsData:', majorsData)
  console.log('schoolId:', schoolId)
  console.log('isLoadingSubjects:', isLoadingSubjects)
  console.log('isLoadingMajors:', isLoadingMajors)
  console.log('subjectsData type:', typeof subjectsData)
  console.log('majorsData type:', typeof majorsData)

  // Get all subjects for search functionality
  const allSubjects: SubjectData[] = subjectsData ? [
    ...(subjectsData.majors.flatMap(major => 
      (major.subjects || []).map(subject => ({
        ...subject,
        major: { name: major.name } // Ensure major info is included
      }))
    ))
  ] : []

  // Filter subjects based on search term
  const filteredSubjects = allSubjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Handle edit subject
  const handleEditSubject = (subject: SubjectData) => {
    setEditingSubject(subject)
  }

  // Handle delete subject
  const handleDeleteSubject = async (subject: SubjectData) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata pelajaran "${subject.name}"?`)) {
      try {
        await deleteSubjectMutation.mutateAsync(subject.id)
        toast.success("Mata pelajaran berhasil dihapus")
      } catch (error: any) {
        toast.error(error.message || "Gagal menghapus mata pelajaran")
      }
    }
  }

  // Close edit modal
  const handleCloseEditModal = () => {
    setEditingSubject(null)
  }

  const handleCreateSubject = async () => {
    try {
      // Gunakan createSubjectMutation, bukan deleteSubjectMutation
      await createSubjectMutation.mutateAsync({
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
        credits: formData.credits,
        schoolId,
        majorId: formData.majorId === "umum" ? undefined : (formData.majorId || undefined),
      })
      toast.success("Mata pelajaran berhasil ditambahkan")
      setIsAdding(false)
      setFormData({
        id: "",
        name: "",
        code: "",
        description: "",
        credits: 1,
        majorId: "umum", // Reset ke "umum"
        isActive: true,
      })
    } catch (error: any) {
      toast.error(error.message || "Gagal menambahkan mata pelajaran")
    }
  }

  if (isLoadingSubjects || isLoadingMajors) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Memuat data mata pelajaran...</p>
        </div>
      </div>
    )
  }

  if (!subjectsData || !majorsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Data Tidak Ditemukan</h1>
          <p className="text-gray-600">Tidak dapat memuat data mata pelajaran</p>
        </div>
      </div>
    )
  }

  const { majors } = subjectsData as SubjectsData
  const totalSubjects = allSubjects.length

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Mata Pelajaran</h1>
          <p className="text-muted-foreground">Kelola mata pelajaran dan kurikulum sekolah</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Mata Pelajaran
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mata pelajaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Add New Subject Form - Inline seperti halaman lama */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tambah Mata Pelajaran Baru
            </CardTitle>
            <CardDescription>Isi informasi mata pelajaran baru</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subjectCode">Kode Mata Pelajaran</Label>
                <Input 
                  id="subjectCode" 
                  placeholder="Contoh: MATH"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectName">Nama Mata Pelajaran</Label>
                <Input 
                  id="subjectName" 
                  placeholder="Contoh: Matematika"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectDescription">Deskripsi</Label>
              <Textarea 
                id="subjectDescription" 
                placeholder="Deskripsi singkat mata pelajaran"
                rows={3}
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subjectCategory">Jurusan</Label>
                <Select
                  value={formData.majorId || "umum"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, majorId: value === "umum" ? null : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jurusan (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umum">Umum</SelectItem>
                    {majorsData?.map((major) => (
                      <SelectItem key={major.id} value={major.id}>
                        {major.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectCredits">SKS</Label>
                <Input 
                  id="subjectCredits" 
                  type="number" 
                  placeholder="4"
                  min="1"
                  max="10"
                  value={formData.credits || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    setFormData(prev => ({ ...prev, credits: isNaN(value) ? 1 : value }))
                  }}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={handleCreateSubject}
                disabled={!formData.name || !formData.code}
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subjects Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-fit justify-start overflow-x-auto bg-muted p-1 rounded-lg border border-border">
          <TabsTrigger 
            value="all" 
            className="flex-shrink-0 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Semua ({totalSubjects})
          </TabsTrigger>
          {majors.map((major) => (
            <TabsTrigger 
              key={major.id} 
              value={major.id} 
              className="flex-shrink-0 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {major.name} ({major.subjects?.length || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Subjects Tab */}
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Daftar Semua Mata Pelajaran
              </CardTitle>
              <CardDescription>Total {filteredSubjects.length} mata pelajaran</CardDescription>
            </CardHeader>
            <CardContent>
              <SubjectsTable
                subjects={filteredSubjects}
                onEdit={handleEditSubject}
                onDelete={handleDeleteSubject}
                majors={majorsData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Major-specific tabs */}
        {majors.map((major) => (
          <TabsContent key={major.id} value={major.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Mata Pelajaran {major.name}
                </CardTitle>
                <CardDescription>{major.description || `Mata pelajaran untuk jurusan ${major.name}`}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {major.subjects?.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      variant="default"
                      onEdit={handleEditSubject}
                      onDelete={handleDeleteSubject}
                    />
                  )) || (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      Belum ada mata pelajaran untuk jurusan ini
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Subject Modal */}
      <SubjectFormModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        mode="create"
        schoolId={schoolId}
        majors={majorsData}
      />

      {/* Edit Subject Modal */}
      {editingSubject && (
        <SubjectFormModal
          isOpen={!!editingSubject}
          onClose={handleCloseEditModal}
          mode="edit"
          subject={editingSubject}
          schoolId={schoolId}
          majors={majorsData}
        />
      )}
    </div>
  )
}
