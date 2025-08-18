import { getServerSession } from "next-auth";
import { prisma } from "../lib/db";
import { authOptions } from "../lib/auth";

export interface CreateContextOptions {
  req: Request;
}

export const createContext = async (opts: CreateContextOptions) => {
  const session = await getServerSession(authOptions);

  return {
    session,
    prisma,
    req: opts.req,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
