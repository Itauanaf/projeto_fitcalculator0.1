import type { CheckInFrequency } from '@/domain/value-objects/check-in-frequency'
import type { Goal } from '@/domain/value-objects/goal'
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

export interface CheckInSchedule {
  frequency: CheckInFrequency
  lastCheckInAt?: Date
  nextCheckInAt?: Date
}

export interface RecentMeasurement {
  id: string
  weightKg: number
  recordedAt: Date
}

export interface RecentCheckIn {
  id: string
  measurementId: string
  weightKg: number
  nutritionAdherencePercentage: number
  submittedAt: Date
}

export interface RecentGoal {
  id: string
  type: Goal
  startedAt: Date
}

export interface LinkedStudentRecord {
  studentId: string
  fullName: string
  startedAt: Date
  latestSnapshot: StudentSnapshotRecord | null
  checkInFrequency: CheckInFrequency
  lastCheckInAt?: Date
  nextCheckInAt?: Date
  hasHealthProfile: boolean
  /** Newest first — enough recent history for the "sem atualização"/"mudança de peso" checks and the activity feed. */
  recentMeasurements: RecentMeasurement[]
  recentCheckIns: RecentCheckIn[]
  recentGoals: RecentGoal[]
  /** Only the fields `calculateGoalProgress` needs — `undefined` when there's no active goal or it has no target weight. */
  activeGoal?: { initialWeightKg?: number; targetWeightKg?: number }
}

/**
 * Port for everything the trainer dashboard reads and writes: the
 * trainer's own profile, the invitations they've sent, and the
 * students actively linked to them (with each student's latest
 * computed snapshot and enough recent history for the dashboard to
 * derive attention flags and an activity feed without a second round
 * of queries — see `HealthSnapshot`'s doc comment on why it exists).
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

  /** Sets the check-in cadence for this trainer↔student link and recomputes `nextCheckInAt` from it. */
  setCheckInFrequency(
    trainerId: string,
    studentId: string,
    frequency: CheckInFrequency
  ): Promise<void>

  /**
   * Stamps `lastCheckInAt`/`nextCheckInAt` on every active trainer link
   * this student has (normally at most one) — called right after a
   * check-in is submitted, from the student side.
   */
  recordCheckInCompleted(studentId: string, submittedAt: Date): Promise<void>

  /** The check-in cadence for this student, from their (first) active trainer link — `null` if they have no trainer. */
  getCheckInScheduleForStudent(studentId: string): Promise<CheckInSchedule | null>
}
