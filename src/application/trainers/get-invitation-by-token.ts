import { hashInviteToken } from '@/infrastructure/auth/invite-tokens'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import type { InvitationLookup } from '@/infrastructure/repositories/trainer-repository'

/** Looks up an invitation by its raw (unhashed) token — the shape the `/convite/[token]` URL carries. */
export async function getInvitationByToken(token: string): Promise<InvitationLookup | null> {
  return new PrismaTrainerRepository().findInvitationByTokenHash(hashInviteToken(token))
}
