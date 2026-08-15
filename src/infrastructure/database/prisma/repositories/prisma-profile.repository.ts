import type { Profile } from '@/domain/entities/profile'
import type { UserRole } from '@/domain/value-objects/user-role'
import type { ProfileRepository } from '@/infrastructure/repositories/profile-repository'
import { prisma } from '../client'

export class PrismaProfileRepository implements ProfileRepository {
  async findById(id: string): Promise<Profile | null> {
    const row = await prisma.profile.findUnique({ where: { id } })
    if (!row) return null

    return {
      id: row.id,
      fullName: row.fullName,
      // The DB enum is SCREAMING_CASE (Prisma/Postgres convention); the
      // domain's UserRole stays lowercase, like every other domain enum.
      role: row.role.toLowerCase() as UserRole,
      avatarUrl: row.avatarUrl ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}
