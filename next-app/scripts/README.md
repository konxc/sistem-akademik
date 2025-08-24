# Sistem Akademik Scripts

Scripts untuk manajemen database Sistem Akademik.

## Prerequisites

Pastikan sudah menginstall dependencies:
```bash
pnpm install
pnpm prisma generate
```

## Scripts Available

### 1. Check Data (`check-data.ts`)
Memeriksa semua data di database:
```bash
pnpm run check-data
# atau
npx tsx check-data.ts
```

### 2. Check Subjects (`check-subjects.ts`)
Memeriksa mata pelajaran dan mengelompokkannya berdasarkan jurusan:
```bash
pnpm run check-subjects
# atau
npx tsx check-subjects.ts
```

### 3. Seed Subjects (`seed-subjects.ts`)
Membuat mata pelajaran default:
```bash
pnpm run seed-subjects
# atau
npx tsx seed-subjects.ts
```

### 4. Update Subject Majors (`update-subject-majors.ts`)
Memperbaiki mata pelajaran yang masih menggunakan kategori "Umum":
```bash
pnpm run update-majors
# atau
npx tsx update-subject-majors.ts
```

## Cara Menggunakan

1. **Masuk ke direktori scripts:**
   ```bash
   cd scripts
   ```

2. **Install tsx (jika belum):**
   ```bash
   pnpm add -D tsx
   ```

3. **Jalankan script yang diinginkan:**
   ```bash
   pnpm run check-data
   pnpm run check-subjects
   pnpm run seed-subjects
   pnpm run update-majors
   ```

## Troubleshooting

### Error: "Cannot find module"
Pastikan sudah menjalankan:
```bash
pnpm prisma generate
```

### Error: "Database connection failed"
Pastikan database PostgreSQL berjalan dan konfigurasi DATABASE_URL sudah benar.

## Notes

- Semua scripts menggunakan TypeScript dan ES Modules
- Scripts akan otomatis disconnect dari database setelah selesai
- Gunakan `check-data.ts` untuk overview database
- Gunakan `update-majors.ts` untuk memperbaiki mata pelajaran yang salah jurusan
