'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'
import { PrismaProfileRepository } from '@/infrastructure/database/prisma/repositories/prisma-profile.repository'
import { loginSchema, type LoginInput } from '@/schemas/auth.schema'
import { getDashboardPathForRole } from './get-dashboard-path-for-role'

export interface AuthActionResult {
  error?: string
}

export async function signIn(input: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Informe um e-mail e senha válidos.' }
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error || !data.user) {
    return { error: 'E-mail ou senha incorretos.' }
  }

  const profile = await new PrismaProfileRepository().findById(data.user.id)
  redirect(getDashboardPathForRole(profile?.role))
}
