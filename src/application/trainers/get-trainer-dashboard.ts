import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import type {
  LinkedStudentRecord,
  StudentInvitationRecord,
  TrainerProfileRecord,
} from '@/infrastructure/repositories/trainer-repository'

export interface TrainerDashboardData {
  trainerProfile: TrainerProfileRecord | null
  invitations: StudentInvitationRecord[]
  students: LinkedStudentRecord[]
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

  return { trainerProfile, invitations, students }
}
