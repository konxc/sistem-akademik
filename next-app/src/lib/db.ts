import { PrismaClient } from '../../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper function untuk pagination
export const getPaginationData = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

// Helper function untuk search dengan multiple fields
export const createSearchFilter = (search: string, fields: string[]) => {
  if (!search) return {};
  
  return {
    OR: fields.map(field => ({
      [field]: {
        contains: search,
        mode: 'insensitive' as const,
      },
    })),
  };
};

// Helper function untuk sorting
export const createSortFilter = (sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc') => {
  if (!sortBy) return { createdAt: 'desc' as const };
  
  return {
    [sortBy]: sortOrder,
  };
};

// Helper function untuk filter active records
export const createActiveFilter = (isActive?: boolean) => {
  if (isActive === undefined) return {};
  
  return { isActive };
};

// Helper function untuk date range filter
export const createDateRangeFilter = (startDate?: Date, endDate?: Date) => {
  if (!startDate && !endDate) return {};
  
  const filter: any = {};
  
  if (startDate) {
    filter.gte = startDate;
  }
  
  if (endDate) {
    filter.lte = endDate;
  }
  
  return filter;
};

// Helper function untuk include relations
export const createIncludeFilter = (includes: string[]) => {
  if (!includes.length) return {};
  
  const include: any = {};
  
  includes.forEach(includeItem => {
    include[includeItem] = true;
  });
  
  return include;
};

// Helper function untuk select specific fields
export const createSelectFilter = (fields: string[]) => {
  if (!fields.length) return {};
  
  const select: any = {};
  
  fields.forEach(field => {
    select[field] = true;
  });
  
  return select;
};

// Helper function untuk transaction
export const withTransaction = async <T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> => {
  return await prisma.$transaction(fn);
};

// Helper function untuk soft delete
export const softDelete = async <T extends { id: string }>(
  model: any,
  id: string
): Promise<T> => {
  return await model.update({
    where: { id },
    data: { isActive: false },
  });
};

// Helper function untuk restore soft deleted record
export const restoreRecord = async <T extends { id: string }>(
  model: any,
  id: string
): Promise<T> => {
  return await model.update({
    where: { id },
    data: { isActive: true },
  });
};

// Helper function untuk bulk operations
export const bulkUpdate = async <T extends { id: string }>(
  model: any,
  ids: string[],
  data: Partial<T>
): Promise<{ count: number }> => {
  return await model.updateMany({
    where: { id: { in: ids } },
    data,
  });
};

export const bulkDelete = async (
  model: any,
  ids: string[]
): Promise<{ count: number }> => {
  return await model.updateMany({
    where: { id: { in: ids } },
    data: { isActive: false },
  });
};

// Helper function untuk count with filters
export const countWithFilters = async (
  model: any,
  where: any
): Promise<number> => {
  return await model.count({ where });
};

// Helper function untuk check if record exists
export const recordExists = async (
  model: any,
  where: any
): Promise<boolean> => {
  const count = await model.count({ where });
  return count > 0;
};

// Helper function untuk get unique values
export const getUniqueValues = async (
  model: any,
  field: string,
  where?: any
): Promise<any[]> => {
  const records = await model.findMany({
    where,
    select: { [field]: true },
    distinct: [field],
  });
  
  return records.map(record => record[field]).filter(Boolean);
};

// Export Prisma client
export default prisma;
