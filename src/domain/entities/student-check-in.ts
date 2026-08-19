/**
 * A student's periodic self-report — always created alongside a
 * `BodyMeasurement` (the weight it references), so `calculateHealthMetrics`
 * has something to recompute from. The subjective fields (energy,
 * hunger, sleep, adherence) exist purely as the student's own record —
 * nothing in the calculation engine reads them.
 */
export interface StudentCheckIn {
  id: string
  studentId: string
  measurementId: string
  /** 1 (worst) to 5 (best). */
  energyLevel: number
  hungerLevel: number
  sleepQuality: number
  workoutsCompleted: number
  /** 0-100. */
  nutritionAdherencePercentage: number
  notes?: string
  submittedAt: Date
}

export const MIN_RATING = 1
export const MAX_RATING = 5

export function isValidRating(value: number): boolean {
  return Number.isInteger(value) && value >= MIN_RATING && value <= MAX_RATING
}

export const MIN_WORKOUTS_COMPLETED = 0
/** A generous upper bound (two-a-days for a full week) — just enough to catch a typo, not to gatekeep. */
export const MAX_WORKOUTS_COMPLETED = 14

export function isValidWorkoutsCompleted(value: number): boolean {
  return (
    Number.isInteger(value) && value >= MIN_WORKOUTS_COMPLETED && value <= MAX_WORKOUTS_COMPLETED
  )
}

export const MIN_ADHERENCE_PERCENTAGE = 0
export const MAX_ADHERENCE_PERCENTAGE = 100

export function isValidAdherencePercentage(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= MIN_ADHERENCE_PERCENTAGE &&
    value <= MAX_ADHERENCE_PERCENTAGE
  )
}
