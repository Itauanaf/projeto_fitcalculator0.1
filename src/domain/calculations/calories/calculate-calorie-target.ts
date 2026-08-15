import { roundToInt } from '../shared/rounding'
import type { CalculateCalorieTargetInput, CalorieTargetResult } from './calorie-target.types'

const FORMULA = 'CALORIE_TARGET_TDEE_ADJUSTMENT' as const
const FORMULA_VERSION = '1.0.0' as const

/**
 * Calorie target = TDEE adjusted by a signed percentage tied to the
 * user's goal. Kept as its own step (not folded into `calculateTdee`
 * or `calculateMacros`) so the deficit/surplus is always an explicit,
 * inspectable input rather than a constant buried in another formula.
 */
export function calculateCalorieTarget(input: CalculateCalorieTargetInput): CalorieTargetResult {
  const { tdee, goal } = input

  if (!Number.isFinite(tdee) || tdee <= 0) {
    throw new Error('calculateCalorieTarget: tdee must be a positive, finite number')
  }
  if (!Number.isFinite(goal.adjustmentPercentage)) {
    throw new Error('calculateCalorieTarget: adjustmentPercentage must be a finite number')
  }

  const value = roundToInt(tdee * (1 + goal.adjustmentPercentage / 100))

  if (value <= 0) {
    throw new Error('calculateCalorieTarget: resulting calorie target must be positive')
  }

  return {
    value,
    unit: 'kcal/day',
    tdee,
    goal,
    formula: FORMULA,
    formulaVersion: FORMULA_VERSION,
  }
}
