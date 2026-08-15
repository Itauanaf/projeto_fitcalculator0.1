'use server'

import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'
import { requestPasswordResetSchema, type RequestPasswordResetInput } from '@/schemas/auth.schema'

export interface RequestPasswordResetResult {
  error?: string
  success?: boolean
}

export async function requestPasswordReset(
  input: RequestPasswordResetInput
): Promise<RequestPasswordResetResult> {
  const parsed = requestPasswordResetSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Informe um e-mail válido.' }
  }

  const supabase = await createSupabaseServerClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/atualizar-senha`,
  })

  // Always report success, even if the email doesn't have an account —
  // otherwise this endpoint becomes a way to check which emails are registered.
  return { success: true }
}
