# Sistem Akademik SMA UII Yogyakarta

Aplikasi modern untuk manajemen akademik SMA UII Yogyakarta. Sistem ini mendukung penjadwalan mata pelajaran, manajemen kelas, presensi, dan pengelolaan pengguna (siswa, guru, staf) yang terintegrasi dengan LDAP.

## Fitur Utama

- **Dashboard**: Ringkasan aktivitas dan statistik akademik.
- **Penjadwalan**: Penjadwalan mata pelajaran seperti Google Calendar.
- **Manajemen Pengguna**: Data siswa, guru, dan staf dari LDAP.
- **Manajemen Mata Pelajaran**: Tambah/edit/hapus mata pelajaran.
- **Manajemen Kelas**: Kelola kelas dan rombongan belajar.
- **Presensi**: Rekap kehadiran siswa, guru, dan staf.

## Tech Stack

- **Next.js (App Router)**
- **React 19**
- **Tailwind CSS** & **shadcn/ui** (UI & styling)
- **tRPC** (end-to-end API)
- **Clerk** (autentikasi)
- **Prisma** (ORM, PostgreSQL)
- **LDAP** (sinkronisasi data pengguna)
- **TanStack React Query** (data fetching & caching)
- **Zod** (validasi schema)
- **Docker Compose** (opsional, untuk development & deployment)

## Struktur Halaman

- `/` : Landing page aplikasi
- `/dashboard` : Dashboard utama
- `/scheduler` : Penjadwalan mata pelajaran
- `/users` : Manajemen pengguna (student, teacher, staff)
- `/subject` : Manajemen mata pelajaran
- `/class` : Manajemen kelas & rombongan belajar

## Cara Pengembangan

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Jalankan server development:
   ```bash
   pnpm dev
   ```
3. Buka aplikasi di browser (lihat port forwarding di Codespaces).

## Konfigurasi Database

Setel URL database PostgreSQL di file `.env`:
```
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db>"
```

## Kontribusi

Pull request dan issue sangat terbuka untuk pengembangan fitur baru dan perbaikan bug.

---

&copy; {new Date().getFullYear()} SMA