import type { Goal } from '@/domain/value-objects/goal'
import type {
  StudentCheckInRecord,
  StudentGoalRecord,
  StudentMeasurementRecord,
} from '@/infrastructure/repositories/student-health-repository'

export interface TimelineEntry {
  id: string
  date: Date
  kind: 'measurement' | 'check_in' | 'goal_started'
  weightKg?: number
  bodyFatPercentage?: number
  waistCm?: number
  // check_in only
  energyLevel?: number
  hungerLevel?: number
  sleepQuality?: number
  workoutsCompleted?: number
  nutritionAdherencePercentage?: number
  // goal_started only
  goalType?: Goal
  /** Only set for `goal_started` when an earlier goal existed — lets the UI show "A → B". */
  previousGoalType?: Goal
}

/**
 * Merges measurements, check-ins and goal changes into one
 * chronological feed — "Sua jornada"/"Histórico" reads straight off
 * this instead of juggling three separately-fetched, separately-sorted
 * lists. A measurement that a check-in was built from is represented
 * only once, as the richer `check_in` entry — not twice.
 */
export function buildStudentTimeline(
  measurements: readonly StudentMeasurementRecord[],
  goals: readonly StudentGoalRecord[],
  checkIns: readonly StudentCheckInRecord[] = []
): TimelineEntry[] {
  const checkedInMeasurementIds = new Set(checkIns.map((checkIn) => checkIn.measurementId))

  const measurementEntries: TimelineEntry[] = measurements
    .filter((measurement) => !checkedInMeasurementIds.has(measurement.id))
    .map((measurement) => ({
      id: `measurement-${measurement.id}`,
      date: measurement.recordedAt,
      kind: 'measurement',
      weightKg: measurement.weightKg,
      bodyFatPercentage: measurement.bodyFatPercentage,
      waistCm: measurement.waistCm,
    }))

  const checkInEntries: TimelineEntry[] = checkIns.map((checkIn) => ({
    id: `check-in-${checkIn.id}`,
    date: checkIn.submittedAt,
    kind: 'check_in',
    weightKg: checkIn.weightKg,
    energyLevel: checkIn.energyLevel,
    hungerLevel: checkIn.hungerLevel,
    sleepQuality: checkIn.sleepQuality,
    workoutsCompleted: checkIn.workoutsCompleted,
    nutritionAdherencePercentage: checkIn.nutritionAdherencePercentage,
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

  return [...measurementEntries, ...checkInEntries, ...goalEntries].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )
}
