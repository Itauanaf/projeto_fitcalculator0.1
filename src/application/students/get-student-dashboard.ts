import { calculateAge } from '@/domain/entities/student-profile'
import { PrismaStudentHealthRepository } from '@/infrastructure/database/prisma/repositories/prisma-student-health.repository'
import type {
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
  goals: StudentGoalRecord[]
  activeGoal: StudentGoalRecord | null
  latestSnapshot: StudentSnapshotRecord | null
}

/**
 * Everything the student dashboard needs to render, loaded in one call
 * so the page component stays a straightforward "load, then render"
 * without orchestrating repository calls itself.
 */
export async function getStudentDashboard(studentId: string): Promise<StudentDashboardData> {
  const repo = new PrismaStudentHealthRepository()

  const [birthDate, healthProfile, measurements, goals, activeGoal, latestSnapshot] =
    await Promise.all([
      repo.getBirthDate(studentId),
      repo.getHealthProfile(studentId),
      repo.listMeasurements(studentId, MEASUREMENT_HISTORY_LIMIT),
      repo.listGoals(studentId),
      repo.getActiveGoal(studentId),
      repo.getLatestSnapshot(studentId),
    ])

  return {
    onboarded: birthDate !== null && healthProfile !== null,
    birthDate: birthDate ?? undefined,
    age: birthDate ? calculateAge(birthDate) : undefined,
    healthProfile: healthProfile ?? undefined,
    measurements,
    goals,
    activeGoal,
    latestSnapshot,
  }
}
