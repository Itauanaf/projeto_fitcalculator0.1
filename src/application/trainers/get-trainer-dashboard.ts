import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import type {
  LinkedStudentRecord,
  StudentInvitationRecord,
  TrainerProfileRecord,
} from '@/infrastructure/repositories/trainer-repository'

/** A check-in counts as "new" on the dashboard if it landed within this many days — there's no read/unread tracking, so this is the simplest honest definition. */
const NEW_CHECK_IN_WINDOW_DAYS = 7

export interface TrainerDashboardData {
  trainerProfile: TrainerProfileRecord | null
  invitations: StudentInvitationRecord[]
  students: LinkedStudentRecord[]
  /** Students whose last check-in landed within the last 7 days. */
  newCheckInsCount: number
}

/**
 * Everything the trainer dashboard needs to render. Ensures the
 * `trainer_profiles` row exists first — invitations and student links
 * both FK into it, and nothing else creates it (signup only ever
 * creates the shared `profiles` row).
 */
export async function getTrainerDashboard(trainerId: string): Promise<TrainerDashboardData> {
  const repo = new PrismaTrainerRepository()
  await repo.ensureTrainerProfile(trainerId)

  const [trainerProfile, invitations, students] = await Promise.all([
    repo.getTrainerProfile(trainerId),
    repo.listInvitations(trainerId),
    repo.listActiveStudents(trainerId),
  ])

  const windowStart = Date.now() - NEW_CHECK_IN_WINDOW_DAYS * 24 * 60 * 60 * 1000
  const newCheckInsCount = students.filter(
    (student) => student.lastCheckInAt && student.lastCheckInAt.getTime() >= windowStart
  ).length

  return { trainerProfile, invitations, students, newCheckInsCount }
}
