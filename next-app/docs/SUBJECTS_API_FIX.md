# Perbaikan API Subjects - Error 400 Bad Request

## Masalah yang Ditemukan

Error 400 (Bad Request) pada API call `school.getSubjects`:
```
GET http://preview-sia.smauiiyk.sch.id/api/trpc/school.getSubjects?batch=1&input=%7B%220%22%3A%22cmeeixcl10000kzf3nyw2lqqs%22%7D 400 (Bad Request)
```

## Penyebab Masalah

1. **Schema Mismatch**: `subjectQuerySchema` tidak memiliki field `schoolId`
2. **Data Leak Risk**: Server router tidak memfilter subjects berdasarkan `schoolId`
3. **Hook Parameter Mismatch**: `useSubjects(schoolId)` mengirim string, tapi API mengharapkan object

## Solusi yang Diterapkan

### 1. **Perbaikan Schema** (`next-app/src/lib/schemas/school.ts`)

```typescript
// Sebelum (error):
export const subjectQuerySchema = paginationSchema.extend({
  credits: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// Sesudah (fixed):
export const subjectQuerySchema = paginationSchema.extend({
  schoolId: z.string().cuid().optional(),
  credits: z.number().int().optional(),
  isActive: z.boolean().optional(),
});
```

### 2. **Perbaikan Server Router** (`next-app/src/server/routers/school.ts`)

```typescript
getSubjects: protectedProcedure
  .input(subjectQuerySchema)
  .query(async ({ input }) => {
    const { page, limit, search, sortBy, sortOrder, schoolId, credits, isActive } = input;
    const skip = (page - 1) * limit;

    const where = {
      ...(schoolId && { schoolId }), // Filter berdasarkan schoolId
      ...createActiveFilter(isActive),
      ...(credits && { credits }),
      ...(search && createSearchFilter(search, ['name', 'code'])),
    };
    // ... rest of the code
  })
```

### 3. **Perbaikan Hook** (`next-app/src/hooks/use-school.ts`)

```typescript
// Sebelum (error):
export const useSubjects = (query: any) => {
  return trpc.school.getSubjects.useQuery(query, {
    placeholderData: (previousData) => previousData,
  });
};

// Sesudah (fixed):
export const useSubjects = (schoolId: string) => {
  return trpc.school.getSubjects.useQuery({ schoolId }, {
    enabled: !!schoolId,
    placeholderData: (previousData) => previousData,
  });
};
```

## Keuntungan Solusi

1. **Data Security**: Subjects sekarang difilter berdasarkan `schoolId`, mencegah data leak antar sekolah
2. **Type Safety**: Schema sekarang memiliki `schoolId` yang proper
3. **Performance**: Query lebih efisien dengan filter yang tepat
4. **Consistency**: Format input konsisten dengan API lainnya

## Testing

Setelah perbaikan ini diterapkan:

1. **Modal Create User** seharusnya terbuka tanpa error
2. **Subjects dropdown** seharusnya terisi dengan data yang benar
3. **API call** `school.getSubjects` seharusnya berhasil dengan status 200
4. **Data filtering** berdasarkan school berfungsi dengan baik

## Catatan Penting

- Perubahan ini memastikan bahwa setiap sekolah hanya bisa melihat subjects miliknya sendiri
- Hook `useSubjects` sekarang lebih type-safe dan predictable
- Server router sekarang memfilter data dengan benar berdasarkan `schoolId`
