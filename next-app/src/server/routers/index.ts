import { createTRPCRouter } from '../trpc';
import { schoolRouter } from './school';

export const appRouter = createTRPCRouter({
  school: schoolRouter,
});

export type AppRouter = typeof appRouter;
