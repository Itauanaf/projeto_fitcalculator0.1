import type { BmiClassification } from '../calculations/bmi/bmi.types'

/**
 * The frozen result of one `calculateHealthMetrics` call for a student,
 * plus which formula versions produced it. Exists so a trainer's
 * dashboard listing many students can read pre-computed numbers instead
 * of recomputing BMI/TDEE/macros for every student on every page load
 * (doc section 32-34).
 *
 * Immutable: a new measurement, goal, or profile change always creates
 * a new snapshot — an existing one is never edited (doc section 37,
 * principle #7). This is what makes a student's history
 * ("15/05 75kg BMI 25.9 → 01/07 70kg BMI 24.2 → ...") just a query over
 * snapshots ordered by `createdAt`, instead of a separate feature.
 */
export interface HealthSnapshot {
  id: string
  studentId: string
  measurementId: string
  goalId?: string

  bmi: number
  bmiClassification: BmiClassification

  bmrKcal: number
  tdeeKcal: number
  calorieTargetKcal: number

  proteinG: number
  carbsG: number
  fatG: number

  bmiFormulaVersion: string
  bmrFormulaVersion: string
  tdeeFormulaVersion: string
  macroFormulaVersion: string

  /**
   * The exact input `calculateHealthMetrics` was called with, so this
   * snapshot can be audited or reproduced even if the underlying
   * profile/measurement/goal rows have since changed.
   */
  inputSnapshot: Record<string, unknown>

  /** The student themself, or the trainer who triggered the recalculation. */
  createdBy: string
  createdAt: Date
}
