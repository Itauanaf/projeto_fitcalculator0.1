import { roundTo } from '../shared/rounding'
import { BMI_BANDS, type HealthyWeightRange } from './bmi.types'

/**
 * Weight range (kg) that lands in the WHO "normal" BMI band for a
 * given height. Shown alongside the BMI result as context, never as
 * a single "ideal weight" number.
 */
export function calculateHealthyWeightRange(heightCm: number): HealthyWeightRange {
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new Error('calculateHealthyWeightRange: heightCm must be a positive, finite number')
  }

  const heightM = heightCm / 100
  const heightM2 = heightM * heightM

  return {
    minKg: roundTo(BMI_BANDS.underweightMax * heightM2, 1),
    // `normalMax` (25) is the exclusive start of "overweight", so the
    // practical upper edge still inside "normal" is just under it.
    maxKg: roundTo((BMI_BANDS.normalMax - 0.1) * heightM2, 1),
  }
}
