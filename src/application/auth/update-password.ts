'use server'

import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'
import { updatePasswordSchema, type UpdatePasswordInput } from '@/schemas/auth.schema'

export interface UpdatePasswordResult {
  error?: string
  success?: boolean
}

/**
 * Sets a new password for whoever the current session belongs to. Only
 * meaningful right after following a password-recovery link (see
 * `/auth/confirm`, which exchanges that link for a session before
 * redirecting here) — with no active session this fails harmlessly.
 */
export async function updatePassword(input: UpdatePasswordInput): Promise<UpdatePasswordResult> {
  const parsed = updatePasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Link de recuperação inválido ou expirado. Solicite um novo.' }
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) {
    return { error: 'Não foi possível atualizar a senha. Tente novamente.' }
  }

  return { success: true }
}
