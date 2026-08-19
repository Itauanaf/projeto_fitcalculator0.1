import type { CheckInStatus } from '@/domain/calculations/check-in-schedule'
import { getCheckInStatus } from '@/domain/calculations/check-in-schedule'
import { calculateAge } from '@/domain/entities/student-profile'
import { PrismaStudentHealthRepository } from '@/infrastructure/database/prisma/repositories/prisma-student-health.repository'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import type {
  StudentCheckInRecord,
  StudentGoalRecord,
  StudentHealthProfileRecord,
  StudentMeasurementRecord,
  StudentSnapshotRecord,
} from '@/infrastructure/repositories/student-health-repository'

/** High enough to cover a year of weekly check-ins with headroom — the evolution chart's "1 ano"/"tudo" periods need more than the default history-list cap. */
const MEASUREMENT_HISTORY_LIMIT = 365

export interface StudentDashboardData {
  /** False until both the birth date and health profile have been saved at least once. */
  onboarded: boolean
  birthDate?: Date
  age?: number
  healthProfile?: StudentHealthProfileRecord
  measurements: StudentMeasurementRecord[]
  checkIns: StudentCheckInRecord[]
  goals: StudentGoalRecord[]
  activeGoal: StudentGoalRecord | null
  latestSnapshot: StudentSnapshotRecord | null
  /** `not_scheduled` when the student has no trainer yet, or their trainer set the frequency to `manual`. */
  checkInStatus: CheckInStatus
}

/**
 * Everything the student dashboard needs to render, loaded in one call
 * so the page component stays a straightforward "load, then render"
 * without orchestrating repository calls itself.
 */
export async function getStudentDashboard(studentId: string): Promise<StudentDashboardData> {
  const repo = new PrismaStudentHealthRepository()

  const [
    birthDate,
    healthProfile,
    measurements,
    checkIns,
    goals,
    activeGoal,
    latestSnapshot,
    schedule,
  ] = await Promise.all([
    repo.getBirthDate(studentId),
    repo.getHealthProfile(studentId),
    repo.listMeasurements(studentId, MEASUREMENT_HISTORY_LIMIT),
    repo.listCheckIns(studentId, MEASUREMENT_HISTORY_LIMIT),
    repo.listGoals(studentId),
    repo.getActiveGoal(studentId),
    repo.getLatestSnapshot(studentId),
    new PrismaTrainerRepository().getCheckInScheduleForStudent(studentId),
  ])

  return {
    onboarded: birthDate !== null && healthProfile !== null,
    birthDate: birthDate ?? undefined,
    age: birthDate ? calculateAge(birthDate) : undefined,
    healthProfile: healthProfile ?? undefined,
    measurements,
    checkIns,
    goals,
    activeGoal,
    latestSnapshot,
    checkInStatus: getCheckInStatus(schedule?.nextCheckInAt),
  }
}
