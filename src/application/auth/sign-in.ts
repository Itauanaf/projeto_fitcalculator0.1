'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'
import { PrismaProfileRepository } from '@/infrastructure/database/prisma/repositories/prisma-profile.repository'
import { loginSchema, type LoginInput } from '@/schemas/auth.schema'
import { getDashboardPathForRole } from './get-dashboard-path-for-role'

export interface AuthActionResult {
  error?: string
}

/** Only ever redirect to a same-site relative path — never follow `next` off-site. */
function isSafeRedirectTarget(next: string | undefined): next is string {
  return !!next && next.startsWith('/') && !next.startsWith('//')
}

/**
 * @param next Where to send the visitor after login instead of their
 * dashboard — e.g. the calculator page that redirected them here to
 * sign in first. Ignored unless it's a safe same-site path.
 */
export async function signIn(input: LoginInput, next?: string): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Informe um e-mail e senha válidos.' }
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error || !data.user) {
    return { error: 'E-mail ou senha incorretos.' }
  }

  if (isSafeRedirectTarget(next)) {
    redirect(next)
  }

  const profile = await new PrismaProfileRepository().findById(data.user.id)
  redirect(getDashboardPathForRole(profile?.role))
}
