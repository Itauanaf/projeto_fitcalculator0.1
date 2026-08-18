'use server'

import { revalidatePath } from 'next/cache'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { generateInviteToken } from '@/infrastructure/auth/invite-tokens'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import { inviteStudentSchema, type InviteStudentFormInput } from '@/schemas/invite-student.schema'

const INVITATION_TTL_DAYS = 7

export interface InviteStudentResult {
  error?: string
  /** The link to hand the student — there's no app email delivery yet, so the trainer shares it directly. */
  inviteUrl?: string
}

/**
 * Creates a `StudentInvitation` and returns the shareable link for it.
 * Nothing sends this by email yet (only Supabase Auth's own emails are
 * wired up) — the trainer is expected to copy and send the link
 * themselves, same as most invite-a-friend flows outside a full
 * transactional-email setup.
 */
export async function inviteStudent(input: InviteStudentFormInput): Promise<InviteStudentResult> {
  const parsed = inviteStudentSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const profile = await getCurrentProfile()
  assertRole(profile, ['trainer', 'admin'])

  const { token, tokenHash } = generateInviteToken()
  const expiresAt = new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000)

  await new PrismaTrainerRepository().createInvitation(profile.id, {
    email: parsed.data.email,
    tokenHash,
    expiresAt,
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  revalidatePath('/app/personal')
  return { inviteUrl: `${siteUrl}/convite/${token}` }
}
