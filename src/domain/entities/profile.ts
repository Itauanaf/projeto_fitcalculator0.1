import type { UserRole } from '../value-objects/user-role'

/**
 * The identity row every authenticated user has, regardless of role.
 * `id` must equal the corresponding Supabase Auth `auth.users.id` — see
 * `prisma/schema.prisma` for why that relationship isn't modeled as a
 * Prisma foreign key (Supabase owns `auth.*`, not this app).
 */
export interface Profile {
  id: string
  fullName: string
  role: UserRole
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}
