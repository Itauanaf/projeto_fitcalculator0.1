import { describe, expect, it } from 'vitest'
import { calculateHealthMetrics } from './calculate-health-metrics'

const PROFILE = {
  age: 30,
  heightCm: 175,
  sex: 'male',
  activityLevel: 'moderate',
  macroStrategy: 'balanced',
} as const

describe('calculateHealthMetrics', () => {
  it('composes bmi, bmr, tdee, calorie target and macros from a profile + measurement + goal', () => {
    const result = calculateHealthMetrics({
      profile: PROFILE,
      measurement: { weightKg: 70 },
      goal: { type: 'lose_weight', adjustmentPercentage: -20 },
    })

    expect(result.bmi).toEqual({
      bmi: 22.86,
      classification: 'normal',
      formula: 'BMI_WHO',
      formulaVersion: '1.0.0',
    })
    expect(result.bmr.value).toBe(1649)
    expect(result.tdee.value).toBe(2556)
    expect(result.calorieTarget.value).toBe(2045)
    expect(result.macros.grams).toEqual({ protein: 128, carbs: 230, fat: 68 })
  })

  it('reuses the same BMR the TDEE result carries, instead of computing it twice', () => {
    const result = calculateHealthMetrics({
      profile: PROFILE,
      measurement: { weightKg: 70 },
      goal: { type: 'maintain', adjustmentPercentage: 0 },
    })

    expect(result.bmr).toBe(result.tdee.bmr)
  })

  it('feeds the calorie target (not the TDEE) into the macro calculation', () => {
    const result = calculateHealthMetrics({
      profile: PROFILE,
      measurement: { weightKg: 70 },
      goal: { type: 'gain_weight', adjustmentPercentage: 15 },
    })

    expect(result.macros.calorieTarget).toBe(result.calorieTarget.value)
    expect(result.macros.calorieTarget).not.toBe(result.tdee.value)
  })

  it('passes a custom macro distribution through when the strategy is custom', () => {
    const result = calculateHealthMetrics({
      profile: { ...PROFILE, macroStrategy: 'custom' },
      measurement: { weightKg: 70 },
      goal: { type: 'maintain', adjustmentPercentage: 0 },
      customMacroDistribution: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    })

    expect(result.macros.distribution).toEqual({ protein: 0.4, carbs: 0.3, fat: 0.3 })
  })

  it('throws when the strategy is custom but no distribution is provided', () => {
    expect(() =>
      calculateHealthMetrics({
        profile: { ...PROFILE, macroStrategy: 'custom' },
        measurement: { weightKg: 70 },
        goal: { type: 'maintain', adjustmentPercentage: 0 },
      })
    ).toThrow()
  })

  it('propagates validation errors from the underlying calculators', () => {
    expect(() =>
      calculateHealthMetrics({
        profile: PROFILE,
        measurement: { weightKg: 0 },
        goal: { type: 'maintain', adjustmentPercentage: 0 },
      })
    ).toThrow()
  })
})
