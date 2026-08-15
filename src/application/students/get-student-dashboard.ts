import { calculateAge } from '@/domain/entities/student-profile'
import { PrismaStudentHealthRepository } from '@/infrastructure/database/prisma/repositories/prisma-student-health.repository'
import type {
  StudentGoalRecord,
  StudentHealthProfileRecord,
  StudentMeasurementRecord,
  StudentSnapshotRecord,
} from '@/infrastructure/repositories/student-health-repository'

export interface StudentDashboardData {
  /** False until both the birth date and health profile have been saved at least once. */
  onboarded: boolean
  birthDate?: Date
  age?: number
  healthProfile?: StudentHealthProfileRecord
  measurements: StudentMeasurementRecord[]
  activeGoal: StudentGoalRecord | null
  latestSnapshot: StudentSnapshotRecord | null
}

/**
 * Everything the student dashboard needs to render, loaded in one call
 * so the page component stays a straightforward "load, then render"
 * without orchestrating five repository calls itself.
 */
export async function getStudentDashboard(studentId: string): Promise<StudentDashboardData> {
  const repo = new PrismaStudentHealthRepository()

  const [birthDate, healthProfile, measurements, activeGoal, latestSnapshot] = await Promise.all([
    repo.getBirthDate(studentId),
    repo.getHealthProfile(studentId),
    repo.listMeasurements(studentId),
    repo.getActiveGoal(studentId),
    repo.getLatestSnapshot(studentId),
  ])

  return {
    onboarded: birthDate !== null && healthProfile !== null,
    birthDate: birthDate ?? undefined,
    age: birthDate ? calculateAge(birthDate) : undefined,
    healthProfile: healthProfile ?? undefined,
    measurements,
    activeGoal,
    latestSnapshot,
  }
}
