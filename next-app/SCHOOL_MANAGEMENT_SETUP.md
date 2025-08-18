# 🏫 School Management System Setup Guide

Sistem manajemen sekolah yang lengkap dengan tRPC, Prisma, dan Zod untuk validasi data.

## 🚀 Fitur Utama

- **School Management**: Manajemen data sekolah
- **Academic Year Management**: Manajemen tahun ajaran
- **Department Management**: Manajemen departemen
- **Major Management**: Manajemen jurusan (IPA, IPS, Bahasa)
- **Class Management**: Manajemen kelas
- **Teacher Management**: Manajemen guru
- **Student Management**: Manajemen siswa
- **Staff Management**: Manajemen staff
- **Subject Management**: Manajemen mata pelajaran
- **Dashboard Statistics**: Statistik dashboard real-time

## 🛠️ Tech Stack

- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **Frontend**: Next.js 15, React 18
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Authentication**: NextAuth.js

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm package manager

## 🔧 Installation & Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Buat file `.env` di root project:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/school_management"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed database with sample data
pnpm db:seed
```

### 4. Development

```bash
# Start development server
pnpm dev

# Open Prisma Studio
pnpm db:studio
```

## 🗄️ Database Schema

### Core Models

#### School
- Informasi dasar sekolah
- Statistik total siswa, guru, kelas, staff
- Status aktif/nonaktif

#### AcademicYear
- Tahun ajaran dengan periode aktif
- Hanya satu tahun ajaran yang aktif per sekolah

#### Department
- Departemen sekolah (Akademik, Kesiswaan, dll)
- Deskripsi dan status

#### Major
- Jurusan (IPA, IPS, Bahasa)
- Kode unik dan deskripsi

#### Class
- Kelas dengan kapasitas dan jumlah siswa saat ini
- Terhubung dengan tahun ajaran dan jurusan

#### Teacher
- Data guru dengan posisi dan mata pelajaran
- Status aktif/nonaktif

#### Student
- Data siswa dengan informasi pribadi
- Terhubung dengan kelas dan sekolah

#### Staff
- Data staff administrasi
- Terhubung dengan departemen

#### Subject
- Mata pelajaran dengan SKS
- Kode unik dan deskripsi

## 🔌 API Endpoints (tRPC)

### School Management
- `school.getSchools` - Daftar sekolah dengan pagination
- `school.getSchoolById` - Detail sekolah berdasarkan ID
- `school.createSchool` - Membuat sekolah baru
- `school.updateSchool` - Update data sekolah
- `school.deleteSchool` - Soft delete sekolah

### Academic Year Management
- `school.getAcademicYears` - Daftar tahun ajaran
- `school.createAcademicYear` - Membuat tahun ajaran
- `school.updateAcademicYear` - Update tahun ajaran

### Department Management
- `school.getDepartments` - Daftar departemen
- `school.createDepartment` - Membuat departemen
- `school.updateDepartment` - Update departemen

### Major Management
- `school.getMajors` - Daftar jurusan
- `school.createMajor` - Membuat jurusan
- `school.updateMajor` - Update jurusan

### Class Management
- `school.getClasses` - Daftar kelas dengan filter
- `school.createClass` - Membuat kelas baru
- `school.updateClass` - Update data kelas

### Teacher Management
- `school.getTeachers` - Daftar guru dengan filter
- `school.createTeacher` - Menambah guru baru
- `school.updateTeacher` - Update data guru

### Student Management
- `school.getStudents` - Daftar siswa dengan filter
- `school.createStudent` - Menambah siswa baru
- `school.updateStudent` - Update data siswa

### Staff Management
- `school.getStaff` - Daftar staff dengan filter
- `school.createStaff` - Menambah staff baru
- `school.updateStaff` - Update data staff

### Subject Management
- `school.getSubjects` - Daftar mata pelajaran
- `school.createSubject` - Menambah mata pelajaran
- `school.updateSubject` - Update mata pelajaran

### Dashboard Statistics
- `school.getDashboardStats` - Statistik dashboard real-time

## 🎯 Custom Hooks

### School Hooks
```typescript
import { useSchools, useCreateSchool, useUpdateSchool } from '@/hooks/use-school';

// Get schools with pagination
const { data, isLoading } = useSchools({ page: 1, limit: 10 });

// Create school
const createSchool = useCreateSchool();
createSchool.mutate(schoolData);

// Update school
const updateSchool = useUpdateSchool();
updateSchool.mutate({ id: 'school-id', data: updateData });
```

### Other Entity Hooks
- `useClasses` - Kelas management
- `useTeachers` - Guru management
- `useStudents` - Siswa management
- `useStaff` - Staff management
- `useSubjects` - Mata pelajaran management
- `useDashboardStats` - Dashboard statistics

## 🔐 Authentication & Authorization

### Middleware
- `protectedProcedure` - Hanya untuk user yang sudah login
- `adminProcedure` - Hanya untuk admin
- `publicProcedure` - Untuk semua user

### Session Management
- Menggunakan NextAuth.js
- Session validation di setiap protected route
- Role-based access control

## 📊 Data Validation

### Zod Schemas
- Validasi input untuk semua entity
- Error messages dalam Bahasa Indonesia
- Type safety untuk TypeScript

### Validation Rules
- Required fields validation
- Email format validation
- Date range validation
- Unique constraint validation

## 🚀 Development Workflow

### 1. Database Changes
```bash
# Update schema
# Edit prisma/schema.prisma

# Generate client
pnpm db:generate

# Push changes
pnpm db:push
```

### 2. API Development
```bash
# Add new router
# Edit src/server/routers/school.ts

# Add new schema
# Edit src/lib/schemas/school.ts

# Add new hooks
# Edit src/hooks/use-school.ts
```

### 3. Testing
```bash
# Test API endpoints
# Use tRPC client in components

# Test database operations
# Use Prisma Studio: pnpm db:studio
```

## 📁 Project Structure

```
next-app/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Seed data
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities & configs
│   │   ├── db.ts        # Database utilities
│   │   ├── schemas/     # Zod schemas
│   │   └── trpc/        # tRPC client config
│   └── server/          # Backend API
│       ├── routers/     # tRPC routers
│       ├── context.ts   # tRPC context
│       └── trpc.ts      # tRPC server config
└── package.json
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Prisma Client Not Generated
```bash
pnpm db:generate
```

#### 2. Database Connection Error
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Check database permissions

#### 3. tRPC API Error
- Check API route configuration
- Verify tRPC provider setup
- Check server logs

#### 4. TypeScript Errors
- Run `pnpm db:generate` after schema changes
- Restart TypeScript server
- Check import paths

## 📚 Additional Resources

- [tRPC Documentation](https://trpc.io/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎉**

Untuk pertanyaan atau bantuan, silakan buat issue di repository ini.
