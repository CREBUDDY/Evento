import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const globalForPrisma = global as unknown as { prisma_new_2: PrismaClient };

export const prisma =
  globalForPrisma.prisma_new_2 ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_new_2 = prisma;
