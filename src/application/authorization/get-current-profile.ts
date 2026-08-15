import { redirect } from 'next/navigation'
import type { Profile } from '@/domain/entities/profile'
import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'
import { PrismaProfileRepository } from '@/infrastructure/database/prisma/repositories/prisma-profile.repository'

interface GetCurrentProfileOptions {
  /** Where to send the visitor back to after they log in — e.g. the calculator page they came from. */
  redirectTo?: string
}

/**
 * The signed-in visitor's profile, or a redirect to `/login` if there's
 * no session. Every page that requires an account calls this first — a
 * URL alone never implies someone is authenticated (doc section 45-46:
 * nothing from the client is trusted without a server-side check).
 */
export async function getCurrentProfile(options?: GetCurrentProfileOptions): Promise<Profile> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const loginUrl = options?.redirectTo
    ? `/login?next=${encodeURIComponent(options.redirectTo)}`
    : '/login'

  if (!user) {
    redirect(loginUrl)
  }

  const profile = await new PrismaProfileRepository().findById(user.id)

  if (!profile) {
    // A session exists but no `profiles` row does — the creation trigger
    // failed or hasn't run yet. Treat this the same as unauthenticated
    // rather than let the rest of the page run against a missing profile.
    redirect(loginUrl)
  }

  return profile
}
