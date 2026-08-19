import type { InvitationStatus } from '@/domain/value-objects/invitation-status'
import type { StudentSnapshotRecord } from './student-health-repository'

export interface TrainerProfileRecord {
  phone?: string
  cref?: string
  bio?: string
}

export interface StudentInvitationRecord {
  id: string
  email: string
  status: InvitationStatus
  expiresAt: Date
  createdAt: Date
}

/** What the invite-acceptance page needs — includes the trainer's name for display. */
export interface InvitationLookup {
  id: string
  trainerId: string
  trainerName: string
  email: string
  status: InvitationStatus
  expiresAt: Date
}

export interface LinkedStudentRecord {
  studentId: string
  fullName: string
  startedAt: Date
  latestSnapshot: StudentSnapshotRecord | null
}

/**
 * Port for everything the trainer dashboard reads and writes: the
 * trainer's own profile, the invitations they've sent, and the
 * students actively linked to them (with each student's latest
 * computed snapshot, so the dashboard never has to recompute anything
 * — see `HealthSnapshot`'s doc comment on why it exists).
 */
export interface TrainerRepository {
  /** Creates an empty `trainer_profiles` row if one doesn't exist yet — invitations and links FK into it. */
  ensureTrainerProfile(trainerId: string): Promise<void>
  getTrainerProfile(trainerId: string): Promise<TrainerProfileRecord | null>
  saveTrainerProfile(trainerId: string, input: TrainerProfileRecord): Promise<void>

  createInvitation(
    trainerId: string,
    input: { email: string; tokenHash: string; expiresAt: Date }
  ): Promise<StudentInvitationRecord>
  listInvitations(trainerId: string): Promise<StudentInvitationRecord[]>

  findInvitationByTokenHash(tokenHash: string): Promise<InvitationLookup | null>
  /** Marks the invitation accepted and creates the active trainer↔student link, in one transaction. */
  acceptInvitation(invitationId: string, trainerId: string, studentId: string): Promise<void>

  listActiveStudents(trainerId: string): Promise<LinkedStudentRecord[]>

  /** Whether this trainer has an active link to this student — the only relationship that grants access to their data. */
  isActivelyLinked(trainerId: string, studentId: string): Promise<boolean>
}
