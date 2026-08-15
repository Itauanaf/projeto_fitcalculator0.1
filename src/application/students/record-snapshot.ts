import type { CalorieGoal } from '@/domain/calculations/calories'
import { calculateHealthMetrics } from '@/domain/calculations/health-metrics'
import type {
  StudentHealthProfileRecord,
  StudentHealthRepository,
  StudentMeasurementRecord,
  StudentSnapshotRecord,
} from '@/infrastructure/repositories/student-health-repository'

interface RecordSnapshotInput {
  studentId: string
  age: number
  healthProfile: StudentHealthProfileRecord
  measurement: StudentMeasurementRecord
  goal: CalorieGoal
  goalId?: string
  createdBy: string
}

/**
 * Runs `calculateHealthMetrics` and persists the result as a new
 * `HealthSnapshot`. Shared by every action that changes an input the
 * snapshot depends on (a new measurement, a new goal) so the
 * "recompute + insert, never update" rule (doc principle #7) is
 * expressed once instead of duplicated per action.
 */
export async function recordSnapshot(
  repo: StudentHealthRepository,
  input: RecordSnapshotInput
): Promise<StudentSnapshotRecord> {
  const { healthProfile } = input

  const customMacroDistribution =
    healthProfile.macroStrategy === 'custom'
      ? {
          protein: (healthProfile.customProteinPercentage ?? 0) / 100,
          carbs: (healthProfile.customCarbsPercentage ?? 0) / 100,
          fat: (healthProfile.customFatPercentage ?? 0) / 100,
        }
      : undefined

  const metrics = calculateHealthMetrics({
    profile: {
      age: input.age,
      heightCm: healthProfile.heightCm,
      sex: healthProfile.sex,
      activityLevel: healthProfile.activityLevel,
      macroStrategy: healthProfile.macroStrategy,
    },
    measurement: { weightKg: input.measurement.weightKg },
    goal: input.goal,
    customMacroDistribution,
  })

  return repo.addSnapshot(input.studentId, {
    measurementId: input.measurement.id,
    goalId: input.goalId,
    bmi: metrics.bmi.bmi,
    bmiClassification: metrics.bmi.classification,
    bmrKcal: Math.round(metrics.bmr.value),
    tdeeKcal: Math.round(metrics.tdee.value),
    calorieTargetKcal: Math.round(metrics.calorieTarget.value),
    proteinG: metrics.macros.grams.protein,
    carbsG: metrics.macros.grams.carbs,
    fatG: metrics.macros.grams.fat,
    bmiFormulaVersion: metrics.bmi.formulaVersion,
    bmrFormulaVersion: metrics.bmr.formulaVersion,
    tdeeFormulaVersion: metrics.tdee.formulaVersion,
    macroFormulaVersion: metrics.macros.formulaVersion,
    inputSnapshot: {
      age: input.age,
      heightCm: healthProfile.heightCm,
      sex: healthProfile.sex,
      activityLevel: healthProfile.activityLevel,
      macroStrategy: healthProfile.macroStrategy,
      weightKg: input.measurement.weightKg,
      goal: input.goal,
    },
    createdBy: input.createdBy,
  })
}
