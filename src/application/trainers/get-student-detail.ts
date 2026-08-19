import { calculateAge } from '@/domain/entities/student-profile'
import { PrismaProfileRepository } from '@/infrastructure/database/prisma/repositories/prisma-profile.repository'
import { PrismaStudentHealthRepository } from '@/infrastructure/database/prisma/repositories/prisma-student-health.repository'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import type {
  StudentCheckInRecord,
  StudentGoalRecord,
  StudentHealthProfileRecord,
  StudentMeasurementRecord,
  StudentSnapshotRecord,
} from '@/infrastructure/repositories/student-health-repository'
import type { CheckInSchedule } from '@/infrastructure/repositories/trainer-repository'

/** Same rationale as `getStudentDashboard` — enough history for the "1 ano"/"tudo" evolution-chart periods. */
const MEASUREMENT_HISTORY_LIMIT = 365

export interface StudentDetail {
  fullName: string
  age?: number
  healthProfile?: StudentHealthProfileRecord
  measurements: StudentMeasurementRecord[]
  checkIns: StudentCheckInRecord[]
  goals: StudentGoalRecord[]
  activeGoal: StudentGoalRecord | null
  latestSnapshot: StudentSnapshotRecord | null
  checkInSchedule: CheckInSchedule | null
}

/**
 * Everything the trainer's student-detail page shows. Assumes the
 * caller has already checked `assertTrainerCanAccessStudent` — this
 * function itself doesn't re-check the trainer/student link, since it
 * only reads the student's own data (the same shape `getStudentDashboard`
 * reads for the student themself).
 */
export async function getStudentDetail(studentId: string): Promise<StudentDetail> {
  const healthRepo = new PrismaStudentHealthRepository()

  const [
    profile,
    birthDate,
    healthProfile,
    measurements,
    checkIns,
    goals,
    activeGoal,
    latestSnapshot,
    checkInSchedule,
  ] = await Promise.all([
    new PrismaProfileRepository().findById(studentId),
    healthRepo.getBirthDate(studentId),
    healthRepo.getHealthProfile(studentId),
    healthRepo.listMeasurements(studentId, MEASUREMENT_HISTORY_LIMIT),
    healthRepo.listCheckIns(studentId, MEASUREMENT_HISTORY_LIMIT),
    healthRepo.listGoals(studentId),
    healthRepo.getActiveGoal(studentId),
    healthRepo.getLatestSnapshot(studentId),
    new PrismaTrainerRepository().getCheckInScheduleForStudent(studentId),
  ])

  return {
    fullName: profile?.fullName ?? 'Aluno',
    age: birthDate ? calculateAge(birthDate) : undefined,
    healthProfile: healthProfile ?? undefined,
    measurements,
    checkIns,
    goals,
    activeGoal,
    latestSnapshot,
    checkInSchedule,
  }
}
