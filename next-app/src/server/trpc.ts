import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';

const t = initTRPC.create();

// Middleware untuk authentication
const isAuthed = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Anda harus login terlebih dahulu',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: session.user,
    },
  });
});

// Middleware untuk role-based access
const isAdmin = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Anda tidak memiliki akses ke fitur ini',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: session.user,
    },
  });
});

// Export procedures
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);

// Base router
export const appRouter = t.router({
  hello: t.procedure.input(z.string()).query(({ input }) => {
    return `Hello, ${input}!`;
  }),
});

export type AppRouter = typeof appRouter;