import { calculateBmr } from '../bmr/calculate-bmr'
import { roundToInt } from '../shared/rounding'
import { ACTIVITY_FACTORS } from './activity-factors'
import type { CalculateTdeeInput, TdeeResult } from './tdee.types'

const FORMULA = 'TDEE_ACTIVITY_FACTOR' as const
const FORMULA_VERSION = '1.0.0' as const

/**
 * Total Daily Energy Expenditure = BMR × activity factor.
 * Builds on `calculateBmr` rather than reimplementing it, so the two
 * can never drift apart.
 */
export function calculateTdee(input: CalculateTdeeInput): TdeeResult {
  const { activityLevel, ...bmrInput } = input
  const bmr = calculateBmr(bmrInput)

  const activityFactor = ACTIVITY_FACTORS[activityLevel]
  if (activityFactor === undefined) {
    throw new Error(`calculateTdee: unsupported activityLevel "${activityLevel}"`)
  }

  return {
    bmr,
    activityLevel,
    activityFactor,
    value: roundToInt(bmr.value * activityFactor),
    unit: 'kcal/day',
    formula: FORMULA,
    formulaVersion: FORMULA_VERSION,
  }
}
