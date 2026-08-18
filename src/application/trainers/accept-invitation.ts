'use server'

import { revalidatePath } from 'next/cache'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { canAcceptInvitation } from '@/domain/entities/student-invitation'
import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'
import { PrismaStudentHealthRepository } from '@/infrastructure/database/prisma/repositories/prisma-student-health.repository'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import { getInvitationByToken } from './get-invitation-by-token'

export interface AcceptInvitationResult {
  error?: string
}

/**
 * Accepts a trainer's invitation: creates the active `TrainerStudent`
 * link and marks the invitation used. Re-validates everything the page
 * already checked (status, expiry, email match) instead of trusting
 * that the button was only ever shown when valid — the page's checks
 * are for the visitor, not for authorization (doc section 45-46).
 */
export async function acceptInvitation(token: string): Promise<AcceptInvitationResult> {
  const profile = await getCurrentProfile({ redirectTo: `/convite/${token}` })
  assertRole(profile, ['student'])

  const invitation = await getInvitationByToken(token)
  if (!invitation) {
    return { error: 'Convite não encontrado.' }
  }
  if (!canAcceptInvitation(invitation)) {
    return { error: 'Este convite expirou ou já foi usado.' }
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.email?.toLowerCase() !== invitation.email.toLowerCase()) {
    return { error: 'Este convite foi enviado para outro e-mail.' }
  }

  // `TrainerStudent.student` FKs into `student_profiles` — a brand-new
  // student who hasn't completed onboarding yet won't have that row.
  await new PrismaStudentHealthRepository().ensureStudentProfile(profile.id)
  await new PrismaTrainerRepository().acceptInvitation(
    invitation.id,
    invitation.trainerId,
    profile.id
  )

  revalidatePath('/app/aluno')
  return {}
}
