import { createTRPCRouter } from '../trpc';
import { schoolRouter } from './school';
import { rombelRouter } from './rombel';
import { classRouter } from './class';
import { userRouter } from './user';
import { departmentRouter } from './department';

export const appRouter = createTRPCRouter({
  school: schoolRouter,
  rombel: rombelRouter,
  class: classRouter,
  user: userRouter,
  department: departmentRouter,
});

export type AppRouter = typeof appRouter;
