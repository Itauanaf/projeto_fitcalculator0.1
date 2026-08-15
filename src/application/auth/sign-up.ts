'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'
import { signUpSchema, type SignUpInput } from '@/schemas/auth.schema'
import { getDashboardPathForRole } from './get-dashboard-path-for-role'

export interface SignUpResult {
  error?: string
  /** True once Supabase has emailed a confirmation link and no session exists yet. */
  needsEmailConfirmation?: boolean
}

/**
 * The `public.profiles` row is created by a database trigger reacting to
 * the `auth.users` insert below (see
 * `prisma/triggers/sync-profiles-with-auth-users.sql`) — this action
 * never writes to `profiles` itself, so there's no way for the two to
 * drift out of sync.
 */
export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const { fullName, email, password, role } = parsed.data
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        // Uppercase to match the `user_role` Postgres enum the trigger casts into.
        role: role.toUpperCase(),
      },
    },
  })

  if (error) {
    const message =
      error.message === 'User already registered'
        ? 'Esse e-mail já está cadastrado.'
        : 'Não foi possível criar a conta. Tente novamente.'
    return { error: message }
  }

  if (!data.session) {
    return { needsEmailConfirmation: true }
  }

  redirect(getDashboardPathForRole(role))
}
