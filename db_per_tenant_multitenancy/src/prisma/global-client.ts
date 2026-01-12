import { PrismaClient as GlobalPrismaClient } from '../generated/prisma/global';

const globalPrisma = new GlobalPrismaClient({
  url: process.env.GLOBAL_DATABASE_URL,
} as any);

export { globalPrisma };