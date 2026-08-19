import type { Goal } from '@/domain/value-objects/goal'

export interface ActivityEntry {
  id: string
  date: Date
  kind: 'measurement' | 'check_in' | 'goal_changed'
  studentName: string
  weightKg?: number
  goalType?: Goal
}

interface StudentActivitySource {
  studentId: string
  fullName: string
  measurements: readonly { id: string; weightKg: number; recordedAt: Date }[]
  checkIns: readonly { id: string; measurementId: string; weightKg: number; submittedAt: Date }[]
  goals: readonly { id: string; type: Goal; startedAt: Date }[]
}

/**
 * "Atividade recente" — a trainer-wide feed built by merging every
 * linked student's measurements, check-ins and goal changes, newest
 * first. Deliberately derived from data that's already stored rather
 * than a separate `activities` table with write-hooks in every mutation
 * path (doc section 35) — same information, far less to keep in sync.
 * A measurement a check-in was built from appears only once, as the
 * check-in (mirrors `buildStudentTimeline`'s same rule).
 */
export function buildTrainerActivityFeed(
  students: readonly StudentActivitySource[],
  limit = 10
): ActivityEntry[] {
  const entries: ActivityEntry[] = []

  for (const student of students) {
    const checkedInMeasurementIds = new Set(student.checkIns.map((c) => c.measurementId))

    for (const measurement of student.measurements) {
      if (checkedInMeasurementIds.has(measurement.id)) continue
      entries.push({
        id: `measurement-${measurement.id}`,
        date: measurement.recordedAt,
        kind: 'measurement',
        studentName: student.fullName,
        weightKg: measurement.weightKg,
      })
    }

    for (const checkIn of student.checkIns) {
      entries.push({
        id: `check-in-${checkIn.id}`,
        date: checkIn.submittedAt,
        kind: 'check_in',
        studentName: student.fullName,
        weightKg: checkIn.weightKg,
      })
    }

    for (const goal of student.goals) {
      entries.push({
        id: `goal-${goal.id}`,
        date: goal.startedAt,
        kind: 'goal_changed',
        studentName: student.fullName,
        goalType: goal.type,
      })
    }
  }

  return entries.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit)
}
