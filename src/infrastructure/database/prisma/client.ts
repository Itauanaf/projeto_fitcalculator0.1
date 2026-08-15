import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

/**
 * A single shared Prisma Client for the whole process. Next.js dev mode
 * hot-reloads modules on every save, which would otherwise construct a
 * fresh `PrismaClient` — and a fresh connection pool — on every edit
 * until the database runs out of connections. Caching the instance on
 * `globalThis` (only in development; production always gets one clean
 * instance) is Prisma's own documented workaround for this.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
