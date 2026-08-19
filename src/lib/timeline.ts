import type { Goal } from '@/domain/value-objects/goal'
import type {
  StudentGoalRecord,
  StudentMeasurementRecord,
} from '@/infrastructure/repositories/student-health-repository'

export interface TimelineEntry {
  id: string
  date: Date
  kind: 'measurement' | 'goal_started'
  weightKg?: number
  bodyFatPercentage?: number
  waistCm?: number
  goalType?: Goal
  /** Only set for `goal_started` when an earlier goal existed — lets the UI show "A → B". */
  previousGoalType?: Goal
}

/**
 * Merges measurements and goal changes into one chronological feed —
 * "Sua jornada"/"Histórico" reads straight off this instead of
 * juggling two separately-fetched, separately-sorted lists. Pure and
 * synchronous: both inputs are already loaded, this just interleaves
 * and sorts them.
 */
export function buildStudentTimeline(
  measurements: readonly StudentMeasurementRecord[],
  goals: readonly StudentGoalRecord[]
): TimelineEntry[] {
  const measurementEntries: TimelineEntry[] = measurements.map((measurement) => ({
    id: `measurement-${measurement.id}`,
    date: measurement.recordedAt,
    kind: 'measurement',
    weightKg: measurement.weightKg,
    bodyFatPercentage: measurement.bodyFatPercentage,
    waistCm: measurement.waistCm,
  }))

  // `goals` arrives newest-first; walking oldest-first lets each entry
  // know what type preceded it, for an "A → B" description.
  const chronologicalGoals = [...goals].reverse()
  const goalEntries: TimelineEntry[] = chronologicalGoals.map((goal, index) => ({
    id: `goal-${goal.id}`,
    date: goal.startedAt,
    kind: 'goal_started',
    goalType: goal.type,
    previousGoalType: index > 0 ? chronologicalGoals[index - 1].type : undefined,
  }))

  return [...measurementEntries, ...goalEntries].sort((a, b) => b.date.getTime() - a.date.getTime())
}
