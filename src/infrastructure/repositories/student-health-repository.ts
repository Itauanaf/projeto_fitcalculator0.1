import type { BmiClassification } from '@/domain/calculations/bmi'
import type { ActivityLevel } from '@/domain/value-objects/activity-level'
import type { Goal } from '@/domain/value-objects/goal'
import type { GoalStatus } from '@/domain/value-objects/goal-status'
import type { MacroStrategy } from '@/domain/value-objects/macro-strategy'
import type { Sex } from '@/domain/value-objects/sex'

/**
 * DB-shaped health profile — a subset of the domain's `HealthProfile`
 * entity without `age` (derived from `StudentProfile.birthDate`, never
 * stored directly — see `calculateAge`) or `goal` (tracked separately
 * as a `StudentGoal` so changing it doesn't erase the previous one).
 */
export interface StudentHealthProfileRecord {
  heightCm: number
  sex: Sex
  activityLevel: ActivityLevel
  macroStrategy: MacroStrategy
  customProteinPercentage?: number
  customCarbsPercentage?: number
  customFatPercentage?: number
}

export interface StudentMeasurementRecord {
  id: string
  weightKg: number
  bodyFatPercentage?: number
  waistCm?: number
  recordedAt: Date
}

export interface StudentGoalRecord {
  id: string
  type: Goal
  targetWeightKg?: number
  calorieAdjustmentPercent: number
  status: GoalStatus
  startedAt: Date
}

export interface StudentSnapshotRecord {
  id: string
  bmi: number
  bmiClassification: BmiClassification
  bmrKcal: number
  tdeeKcal: number
  calorieTargetKcal: number
  proteinG: number
  carbsG: number
  fatG: number
  createdAt: Date
}

export interface NewSnapshotInput {
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
  inputSnapshot: Record<string, unknown>
  createdBy: string
}

/**
 * Port for everything the student dashboard reads and writes: the
 * student's birth date, their health profile, their measurement
 * history, their goal, and the computed snapshots that tie all of it
 * together. Modeled as one port (not one per table) because every
 * write here — a new measurement, a new goal — always needs to read
 * the others to compute a fresh snapshot; splitting the port would
 * just move that coupling into every caller instead of removing it.
 */
export interface StudentHealthRepository {
  getBirthDate(studentId: string): Promise<Date | null>
  getHealthProfile(studentId: string): Promise<StudentHealthProfileRecord | null>

  /** Upserts both the `student_profiles` row (birth date) and the `health_profiles` row in one write. */
  saveHealthProfile(
    studentId: string,
    input: { birthDate: Date } & StudentHealthProfileRecord
  ): Promise<void>

  listMeasurements(studentId: string, limit?: number): Promise<StudentMeasurementRecord[]>
  addMeasurement(
    studentId: string,
    input: { weightKg: number; bodyFatPercentage?: number; waistCm?: number; recordedBy: string }
  ): Promise<StudentMeasurementRecord>

  getActiveGoal(studentId: string): Promise<StudentGoalRecord | null>
  /** Ends any currently active goal (status → `cancelled`) and inserts the new one as `active`. */
  setGoal(
    studentId: string,
    input: {
      type: Goal
      targetWeightKg?: number
      calorieAdjustmentPercent: number
      createdBy: string
    }
  ): Promise<StudentGoalRecord>

  getLatestSnapshot(studentId: string): Promise<StudentSnapshotRecord | null>
  addSnapshot(studentId: string, input: NewSnapshotInput): Promise<StudentSnapshotRecord>
}
