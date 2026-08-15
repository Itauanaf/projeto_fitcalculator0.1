/**
 * Status of a `StudentInvitation`. A trainer never creates a student's
 * account directly — they send an invitation, which becomes a
 * `TrainerStudent` link only once the student accepts it.
 */
export const INVITATION_STATUS_VALUES = ['pending', 'accepted', 'expired', 'cancelled'] as const

export type InvitationStatus = (typeof INVITATION_STATUS_VALUES)[number]
