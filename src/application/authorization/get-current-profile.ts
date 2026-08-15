import { redirect } from 'next/navigation'
import type { Profile } from '@/domain/entities/profile'
import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'
import { PrismaProfileRepository } from '@/infrastructure/database/prisma/repositories/prisma-profile.repository'

/**
 * The signed-in visitor's profile, or a redirect to `/login` if there's
 * no session. Every page under `/app/*` calls this first — a URL alone
 * never implies someone is authenticated (doc section 45-46: nothing
 * from the client is trusted without a server-side check).
 */
export async function getCurrentProfile(): Promise<Profile> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await new PrismaProfileRepository().findById(user.id)

  if (!profile) {
    // A session exists but no `profiles` row does — the creation trigger
    // failed or hasn't run yet. Treat this the same as unauthenticated
    // rather than let the rest of the page run against a missing profile.
    redirect('/login')
  }

  return profile
}
