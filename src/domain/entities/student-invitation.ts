import type { InvitationStatus } from '../value-objects/invitation-status'

/**
 * A trainer's invitation for a student to join them. A trainer never
 * creates a student's account directly (see doc section 25) — this is
 * the record that exists between "trainer typed an email" and "student
 * accepted and a `TrainerStudent` link was created".
 *
 * Only the invitation token's hash is stored, never the raw token — the
 * token is a bearer credential that grants account linking, so it gets
 * the same treatment as a password (principle from doc section 26).
 */
export interface StudentInvitation {
  id: string
  trainerId: string
  email: string
  tokenHash: string
  status: InvitationStatus
  expiresAt: Date
  acceptedByStudentId?: string
  acceptedAt?: Date
  createdAt: Date
}

/** Whether an invitation's window to be accepted has passed. */
export function isInvitationExpired(
  invitation: StudentInvitation,
  asOf: Date = new Date()
): boolean {
  return asOf.getTime() >= invitation.expiresAt.getTime()
}

/** Whether an invitation can still be accepted right now. */
export function canAcceptInvitation(
  invitation: StudentInvitation,
  asOf: Date = new Date()
): boolean {
  return invitation.status === 'pending' && !isInvitationExpired(invitation, asOf)
}
