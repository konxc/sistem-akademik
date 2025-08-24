# 🏢 Department Management Setup

## 📋 Overview
Sistem manajemen departemen untuk sekolah yang memungkinkan admin mengelola unit kerja untuk staff dan guru.

## 🚀 Setup Instructions

### 1. Database Schema
Pastikan Prisma schema sudah memiliki model Department:
```prisma
model Department {
  id          String   @id @default(cuid())
  name        String
  description String?
  schoolId    String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  school School  @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  staff  Staff[]

  @@map("departments")
}
```

### 2. Seed Data
Jalankan seed untuk membuat data departemen awal:
```bash
# Seed departments only
npm run db:seed:departments

# Or seed all data
npm run db:seed:all
```

### 3. tRPC Router
Router department sudah tersedia di `src/server/routers/department.ts` dengan endpoints:
- `createDepartment` - Membuat departemen baru
- `updateDepartment` - Update departemen
- `deleteDepartment` - Hapus departemen
- `getDepartments` - Ambil semua departemen
- `getDepartmentById` - Ambil departemen berdasarkan ID

### 4. React Hooks
Custom hooks tersedia di `src/hooks/use-department.ts`:
- `useDepartments(schoolId, isActive?)` - Query departemen
- `useCreateDepartment()` - Mutation create
- `useUpdateDepartment()` - Mutation update
- `useDeleteDepartment()` - Mutation delete

### 5. UI Integration
Card departemen sudah terintegrasi di halaman school-management tab organization dengan fitur:
- ✅ Display daftar departemen
- ✅ Loading state
- ✅ Empty state
- ✅ Staff count per departemen
- ✅ Action buttons (Edit/Delete)

## 🔧 Features

### Department Card
- **Name**: Nama departemen
- **Description**: Deskripsi fungsi
- **Status**: Badge aktif/tidak aktif
- **Staff Count**: Jumlah staff di departemen
- **Actions**: Edit dan Delete

### Data Structure
```typescript
interface Department {
  id: string
  name: string
  description: string | null
  isActive: boolean
  schoolId: string
  staffCount: number
  teacherCount: number // Always 0 (no relation in current schema)
  createdAt: Date
  updatedAt: Date
}
```

## 🎯 Usage Examples

### Create Department
```typescript
const createDepartment = useCreateDepartment()

const handleCreate = () => {
  createDepartment.mutate({
    name: 'Akademik',
    description: 'Bertanggung jawab atas kurikulum',
    schoolId: 'school-id',
    isActive: true
  })
}
```

### Get Departments
```typescript
const { data: departments, isLoading } = useDepartments(schoolId, true)
```

## 🚨 Important Notes

1. **Teacher Relation**: Saat ini Teacher tidak memiliki relasi dengan Department dalam schema Prisma
2. **Staff Only**: Department hanya terkait dengan Staff
3. **School Scoped**: Setiap departemen harus terkait dengan school tertentu
4. **Validation**: Nama departemen harus unik per school

## 🔄 Future Enhancements

- [ ] Add Teacher-Department relationship
- [ ] Department hierarchy (parent-child)
- [ ] Department budget management
- [ ] Department performance metrics
- [ ] Bulk import/export departments

## 🐛 Troubleshooting

### Common Issues

1. **"Department not found"**
   - Pastikan school sudah di-seed
   - Check schoolId parameter

2. **"Cannot delete department with staff"**
   - Pindahkan staff ke departemen lain dulu
   - Atau hapus staff yang terkait

3. **"Department name already exists"**
   - Nama departemen harus unik per school
   - Gunakan nama yang berbeda

### Debug Commands
```bash
# Check database
npm run db:studio

# Reset and reseed
npm run db:reset
npm run db:seed:all
```
