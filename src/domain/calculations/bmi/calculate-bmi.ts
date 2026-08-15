import { roundTo } from '../shared/rounding'
import type { BmiResult, CalculateBmiInput } from './bmi.types'
import { classifyBmi } from './classify-bmi'

const FORMULA = 'BMI_WHO' as const
const FORMULA_VERSION = '1.0.0' as const

/**
 * BMI = weight(kg) / height(m)². `heightCm` is taken in centimeters
 * (matching how it's collected everywhere else in the app) and
 * converted internally.
 */
export function calculateBmi(input: CalculateBmiInput): BmiResult {
  const { weightKg, heightCm } = input

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error('calculateBmi: weightKg must be a positive, finite number')
  }
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new Error('calculateBmi: heightCm must be a positive, finite number')
  }

  const heightM = heightCm / 100
  const bmi = roundTo(weightKg / (heightM * heightM), 2)

  return {
    bmi,
    classification: classifyBmi(bmi),
    formula: FORMULA,
    formulaVersion: FORMULA_VERSION,
  }
}
