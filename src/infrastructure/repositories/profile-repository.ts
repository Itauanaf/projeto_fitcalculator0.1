import type { Profile } from '@/domain/entities/profile'

/**
 * Port for reading a user's identity/role. Auth (Supabase) answers "who
 * is this?"; this repository answers "what do we know about them?" —
 * see doc section 7 for why those stay separate.
 */
export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>
}
