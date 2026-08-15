import { roundToInt } from '../shared/rounding'
import type { BmrResult, CalculateBmrInput } from './bmr.types'
import { mifflinStJeorFemale, mifflinStJeorMale } from './mifflin-st-jeor'

const FORMULA = 'MIFFLIN_ST_JEOR' as const
const FORMULA_VERSION = '1.0.0' as const

/**
 * Basal Metabolic Rate via Mifflin-St Jeor — the calories the body
 * burns at rest. This is a standalone layer that `calculateTdee`
 * builds on; it's never inlined into the TDEE calculation.
 */
export function calculateBmr(input: CalculateBmrInput): BmrResult {
  const { weightKg, heightCm, age, sex } = input

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error('calculateBmr: weightKg must be a positive, finite number')
  }
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new Error('calculateBmr: heightCm must be a positive, finite number')
  }
  if (!Number.isFinite(age) || age <= 0) {
    throw new Error('calculateBmr: age must be a positive, finite number')
  }

  const formulaInput = { weightKg, heightCm, age }

  let rawBmr: number
  switch (sex) {
    case 'male':
      rawBmr = mifflinStJeorMale(formulaInput)
      break
    case 'female':
      rawBmr = mifflinStJeorFemale(formulaInput)
      break
    default: {
      const exhaustiveCheck: never = sex
      throw new Error(`calculateBmr: unsupported sex "${exhaustiveCheck}"`)
    }
  }

  return {
    value: roundToInt(rawBmr),
    unit: 'kcal/day',
    formula: FORMULA,
    formulaVersion: FORMULA_VERSION,
  }
}
