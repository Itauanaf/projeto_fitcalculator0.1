import { calculateBmi } from '../bmi/calculate-bmi'
import { calculateCalorieTarget } from '../calories/calculate-calorie-target'
import { calculateMacros } from '../macros/calculate-macros'
import { calculateTdee } from '../tdee/calculate-tdee'
import type { CalculateHealthMetricsInput, HealthMetricsResult } from './health-metrics.types'

/**
 * The single entry point that turns a profile + latest measurement + goal
 * into every indicator the app shows: BMI, BMR, TDEE, calorie target and
 * macros. Exists so the trainer dashboard (and anywhere else that needs
 * "all of a student's numbers") calls one function instead of
 * re-orchestrating the five calculators by hand each time.
 *
 * Pure composition over the already-tested calculators below — it adds
 * no formula of its own, so there's nothing new to get wrong here beyond
 * wiring the right output into the right input.
 */
export function calculateHealthMetrics(input: CalculateHealthMetricsInput): HealthMetricsResult {
  const { profile, measurement, goal, customMacroDistribution } = input
  const { age, heightCm, sex, activityLevel, macroStrategy } = profile
  const { weightKg } = measurement

  const bmi = calculateBmi({ weightKg, heightCm })

  // calculateTdee already computes BMR internally — reuse its result
  // instead of calling calculateBmr a second time.
  const tdee = calculateTdee({ weightKg, heightCm, age, sex, activityLevel })

  const calorieTarget = calculateCalorieTarget({ tdee: tdee.value, goal })

  const macros = calculateMacros({
    calorieTarget: calorieTarget.value,
    strategy: macroStrategy,
    customDistribution: customMacroDistribution,
  })

  return { bmi, bmr: tdee.bmr, tdee, calorieTarget, macros }
}
