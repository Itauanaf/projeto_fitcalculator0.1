import { describe, expect, it } from 'vitest'
import { calculateCalorieTarget } from './calculate-calorie-target'
import { DEFAULT_ADJUSTMENT_PERCENTAGE } from './default-adjustments'

describe('calculateCalorieTarget', () => {
  it('applies a configurable deficit', () => {
    const result = calculateCalorieTarget({
      tdee: 2550,
      goal: { type: 'lose_weight', adjustmentPercentage: -20 },
    })
    expect(result.value).toBe(2040)
  })

  it('applies a configurable surplus', () => {
    const result = calculateCalorieTarget({
      tdee: 2550,
      goal: { type: 'gain_weight', adjustmentPercentage: 15 },
    })
    expect(result.value).toBe(2933)
  })

  it('leaves the target unchanged at maintenance (0%)', () => {
    const result = calculateCalorieTarget({
      tdee: 2550,
      goal: { type: 'maintain', adjustmentPercentage: 0 },
    })
    expect(result.value).toBe(2550)
  })

  it('does not hardcode a percentage per goal — the caller can override the default', () => {
    const custom = calculateCalorieTarget({
      tdee: 2550,
      goal: { type: 'lose_weight', adjustmentPercentage: -10 },
    })
    const usingDefault = calculateCalorieTarget({
      tdee: 2550,
      goal: {
        type: 'lose_weight',
        adjustmentPercentage: DEFAULT_ADJUSTMENT_PERCENTAGE.lose_weight,
      },
    })
    expect(custom.value).not.toBe(usingDefault.value)
  })

  it('reports the formula used', () => {
    const result = calculateCalorieTarget({
      tdee: 2000,
      goal: { type: 'maintain', adjustmentPercentage: 0 },
    })
    expect(result.formula).toBe('CALORIE_TARGET_TDEE_ADJUSTMENT')
    expect(result.formulaVersion).toBe('1.0.0')
  })

  it('throws for a non-positive tdee', () => {
    expect(() =>
      calculateCalorieTarget({ tdee: 0, goal: { type: 'maintain', adjustmentPercentage: 0 } })
    ).toThrow()
  })

  it('throws when the adjustment would zero out or invert the target', () => {
    expect(() =>
      calculateCalorieTarget({
        tdee: 1500,
        goal: { type: 'lose_weight', adjustmentPercentage: -100 },
      })
    ).toThrow()
  })
})

describe('DEFAULT_ADJUSTMENT_PERCENTAGE', () => {
  it('is negative for weight loss, zero for maintenance and positive for gain', () => {
    expect(DEFAULT_ADJUSTMENT_PERCENTAGE.lose_weight).toBeLessThan(0)
    expect(DEFAULT_ADJUSTMENT_PERCENTAGE.maintain).toBe(0)
    expect(DEFAULT_ADJUSTMENT_PERCENTAGE.gain_weight).toBeGreaterThan(0)
    expect(DEFAULT_ADJUSTMENT_PERCENTAGE.gain_muscle).toBeGreaterThan(0)
  })
})
