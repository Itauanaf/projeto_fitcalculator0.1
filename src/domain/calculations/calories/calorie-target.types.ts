import type { Goal } from '../../value-objects/goal'

export interface CalorieGoal {
  type: Goal
  /**
   * Signed percentage applied to TDEE: negative for a deficit,
   * positive for a surplus, 0 for maintenance (e.g. -20 means
   * "20% below TDEE"). Always explicit — never hardcoded per goal
   * inside the calculation — so it stays user-configurable.
   */
  adjustmentPercentage: number
}

export interface CalculateCalorieTargetInput {
  tdee: number
  goal: CalorieGoal
}

export interface CalorieTargetResult {
  value: number
  unit: 'kcal/day'
  tdee: number
  goal: CalorieGoal
  formula: 'CALORIE_TARGET_TDEE_ADJUSTMENT'
  formulaVersion: '1.0.0'
}
