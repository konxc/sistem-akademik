# Troubleshooting Create User Modal

## Masalah: Tombol Submit Tetap Disabled

### Deskripsi Masalah
Meskipun semua field untuk user student sudah diisi, tombol "Create User" tetap dalam keadaan disabled.

### Penyebab yang Mungkin

1. **Field Dasar Tidak Terisi**
   - `name` - Nama lengkap user
   - `email` - Email user

2. **Field Student-Specific Tidak Terisi**
   - `studentId` - ID student
   - `classId` - ID class
   - `majorId` - ID major

3. **Data Dropdown Tidak Terisi**
   - Classes dropdown kosong
   - Majors dropdown kosong

4. **Field Major Hilang dari UI** ⚠️ **BARU DIPERBAIKI**
   - Field Major tidak ditampilkan di form student
   - Validasi tetap memeriksa `majorId` yang kosong

### Solusi yang Diterapkan

#### 1. **Perbaikan Fungsi Validasi**
```typescript
const isFormValid = () => {
  // Basic validation - harus selalu ada
  if (!formData.name || !formData.email) {
    console.log('Basic validation failed:', { name: formData.name, email: formData.email })
    return false
  }
  
  // Role-specific validation
  switch (activeTab) {
    case 'student':
      const studentValid = !!(formData.studentId && formData.classId && formData.majorId)
      console.log('Student validation:', { 
        studentId: formData.studentId, 
        classId: formData.classId, 
        majorId: formData.majorId,
        isValid: studentValid 
      })
      return studentValid
    // ... other cases
  }
}
```

#### 2. **Debug Logging**
- Console log untuk setiap validasi
- Debug info panel di development mode
- Real-time status form validation

#### 3. **Debug Info Panel**
```typescript
{/* Debug Info */}
{process.env.NODE_ENV === 'development' && (
  <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
    <div className="font-semibold mb-2">Debug Info:</div>
    <div>Active Tab: {activeTab}</div>
    <div>Form Valid: {isFormValid() ? '✅' : '❌'}</div>
    <div>Name: {formData.name || 'empty'}</div>
    <div>Email: {formData.email || 'empty'}</div>
    {activeTab === 'student' && (
      <>
        <div>Student ID: {formData.studentId || 'empty'}</div>
        <div>Class ID: {formData.classId || 'empty'}</div>
        <div>Major ID: {formData.majorId || 'empty'}</div>
      </>
    )}
    <div>Mutation Pending: {createUserMutation.isPending ? 'Yes' : 'No'}</div>
  </div>
)}
```

#### 4. **Perbaikan Field Major yang Hilang** ⚠️ **BARU DIPERBAIKI**
```typescript
<div className="space-y-2">
  <Label htmlFor="majorId">Major *</Label>
  <Select
    value={formData.majorId}
    onValueChange={(value) => handleInputChange('majorId', value)}
  >
    <SelectTrigger>
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
```

#### 5. **Perbaikan Form Student yang Lebih Sederhana** ⚠️ **BARU DIPERBAIKI**
```typescript
// Class dropdown - Sederhana (X, XI, XII)
<SelectItem value="X">X</SelectItem>
<SelectItem value="XI">XI</SelectItem>
<SelectItem value="XII">XII</SelectItem>

// Gender - Wajib, hanya Male/Female
<SelectItem value="MALE">Male</SelectItem>
<SelectItem value="FEMALE">Female</SelectItem>

// Rombel - Field baru untuk konsistensi i18n
<SelectItem key={rombel.id} value={rombel.id}>
  {rombel.name}
</SelectItem>
```

#### 6. **Fitur Dependency Field** ⚠️ **BARU DITAMBAHKAN**
```typescript
// Major → Class → Rombel dependency
// 1. Pilih Major dulu
onValueChange={(value) => {
  handleInputChange('majorId', value)
  // Reset class dan rombel ketika major berubah
  handleInputChange('classId', '')
  handleInputChange('rombelId', '')
}}

// 2. Class disabled sampai Major dipilih
disabled={!formData.majorId}
placeholder={formData.majorId ? "Pilih class" : "Pilih major dulu"}

// 3. Rombel disabled sampai Class dipilih
disabled={!formData.classId}
placeholder={formData.classId ? "Pilih rombel" : "Pilih class dulu"}

// 4. Filter rombel berdasarkan class yang dipilih
{rombels?.filter(rombel => 
  rombel.classId === formData.classId
).map((rombel) => (
  <SelectItem key={rombel.id} value={rombel.id}>
    {rombel.name}
  </SelectItem>
))}
```

#### 7. **Class Dinamis Berdasarkan Major** ⚠️ **BARU DITAMBAHKAN**
```typescript
// Hook useClasses dengan filter majorId
const { data: classes, isLoading: isClassesLoading } = useClasses({ 
  schoolId, 
  majorId: formData.majorId || undefined 
})

// Filter class berdasarkan major yang dipilih
{classes?.data?.filter(cls => 
  cls.majorId === formData.majorId
).map((cls: { id: string; name: string; grade: number }) => (
  <SelectItem key={cls.id} value={cls.id}>
    {cls.grade === 10 ? 'X' : cls.grade === 11 ? 'XI' : cls.grade === 12 ? 'XII' : `Kelas ${cls.grade}`}
  </SelectItem>
))}

// Loading state dan error handling
{!formData.majorId ? (
  <SelectItem value="no-major" disabled>Pilih major terlebih dahulu</SelectItem>
) : isClassesLoading ? (
  <SelectItem value="loading" disabled>Loading classes...</SelectItem>
) : classes?.data?.length === 0 ? (
  <SelectItem value="no-classes" disabled>Tidak ada class untuk major ini</SelectItem>
) : (
  // Render filtered classes
)}
```

#### 8. **Perbaikan Error SelectItem Value Kosong** ⚠️ **BARU DIPERBAIKI**
```typescript
// SEBELUM (Error):
<SelectItem value="" disabled>Pilih major terlebih dahulu</SelectItem>

// SESUDAH (Fixed):
<SelectItem value="no-major" disabled>Pilih major terlebih dahulu</SelectItem>
<SelectItem value="loading" disabled>Loading classes...</SelectItem>
<SelectItem value="no-classes" disabled>Tidak ada class untuk major ini</SelectItem>

// Untuk subjects select:
<SelectItem value="add-subject" disabled>Pilih subject</SelectItem>
```

#### 9. **Perbaikan Tampilan Class** ⚠️ **BARU DIPERBAIKI**
```typescript
// SEBELUM (Redundant):
{cls.name} (Kelas {cls.grade})
// Contoh: "XI IPA (Kelas 11)" - Redundant karena major sudah "IPA"

// SESUDAH (Clean):
{cls.grade === 10 ? 'X' : cls.grade === 11 ? 'XI' : cls.grade === 12 ? 'XII' : `Kelas ${cls.grade}`}
// Contoh: "XI" - Lebih clean dan jelas

// Logic:
// Grade 10 → "X"
// Grade 11 → "XI" 
// Grade 12 → "XII"
// Grade lain → "Kelas {grade}"
```

#### 10. **Struktur Form yang Benar** ⚠️ **BARU DIPERBAIKI**
```typescript
// STRUKTUR LAMA (Salah):
Major → Class → Rombel

// STRUKTUR BARU (Benar):
Major → Grade → Class → Rombel

// Implementasi:
// 1. Major: Pilih jurusan (IPA, IPS, Bahasa)
// 2. Grade: Pilih grade (10, 11, 12) - sebagai filter intermediate
// 3. Class: Pilih nama kelas berdasarkan major + grade
// 4. Rombel: Pilih rombel berdasarkan class

// Filter Class:
classes?.data?.filter(cls => 
  cls.majorId === formData.majorId && 
  cls.grade === parseInt(formData.grade)
)

// Auto-Reset Logic:
// Major berubah → Reset Grade, Class, Rombel
// Grade berubah → Reset Class, Rombel
// Class berubah → Reset Rombel
```

### Langkah Troubleshooting

#### 1. **Buka Browser Console**
- Tekan F12 → Console tab
- Lihat log validation yang muncul

#### 2. **Periksa Debug Info Panel**
- Panel debug akan muncul di bawah form
- Tunjukkan status setiap field secara real-time

#### 3. **Periksa Data Dropdown**
- Pastikan ada data classes dan majors
- Pastikan `schoolId` valid

#### 4. **Network Tab**
- Lihat apakah API calls berhasil
- Periksa response dari `school.getClasses` dan `school.getMajors`

#### 5. **Flow Dependency Field** ⚠️ **BARU DITAMBAHKAN**
- **Major** harus dipilih terlebih dahulu
- **Class** akan enabled setelah Major dipilih
- **Rombel** akan enabled setelah Class dipilih
- **Reset otomatis**: Ketika Major berubah, Class dan Rombel akan reset
- **Reset otomatis**: Ketika Class berubah, Rombel akan reset

#### 6. **Class Dinamis dari Database** ⚠️ **BARU DITAMBAHKAN**
- **Class** sekarang diambil dari database, bukan dropdown statis
- **Filter**: Class hanya menampilkan yang sesuai dengan major yang dipilih
- **Loading state**: Menampilkan "Loading classes..." saat fetch data
- **Empty state**: Menampilkan "Tidak ada class untuk major ini" jika kosong
- **Format**: `{className} (Kelas {grade})` - contoh: "IPA-1 (Kelas 10)"

### Field yang Wajib Diisi

#### **Student Tab:**
- ✅ **Name** (wajib)
- ✅ **Email** (wajib)
- ✅ **Student ID** (wajib)
- ✅ **Class** (wajib) - X, XI, XII
- ✅ **Major** (wajib)
- ✅ **Rombel** (wajib) - **BARU DITAMBAHKAN**
- ✅ **Gender** (wajib) - Male/Female

#### **Teacher Tab:**
- ✅ **Name** (wajib)
- ✅ **Email** (wajib)
- ✅ **Teacher ID** (wajib)
- ✅ **Employee ID** (wajib)

#### **Staff Tab:**
- ✅ **Name** (wajib)
- ✅ **Email** (wajib)
- ✅ **Employee ID** (wajib)
- ✅ **Position** (wajib)

#### **Admin Tab:**
- ✅ **Name** (wajib)
- ✅ **Email** (wajib)
- ✅ **Password** (wajib)

### Testing Checklist

1. **Buka Modal Create User**
2. **Pilih tab "Student"**
3. **Isi semua field wajib**
4. **Periksa console log**
5. **Periksa debug info panel**
6. **Tombol submit seharusnya enabled**

### Jika Masih Bermasalah

1. **Periksa Console Log** - lihat error validation
2. **Periksa Network Tab** - pastikan API calls berhasil
3. **Periksa Data** - pastikan ada data classes/majors
4. **Periksa School ID** - pastikan valid

### Catatan Penting

- Debug info hanya muncul di development mode
- Console log akan menunjukkan detail validasi
- Pastikan semua field wajib terisi sebelum submit
- Field opsional tidak mempengaruhi validasi
