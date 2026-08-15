import { describe, expect, it } from 'vitest'
import { MACRO_STRATEGY_VALUES } from '../../value-objects/macro-strategy'
import { calculateMacros } from './calculate-macros'

describe('calculateMacros', () => {
  it('matches the reference example (2200 kcal, balanced)', () => {
    const result = calculateMacros({ calorieTarget: 2200, strategy: 'balanced' })
    expect(result.grams).toEqual({ protein: 138, carbs: 248, fat: 73 })
    expect(result.distribution).toEqual({ protein: 0.25, carbs: 0.45, fat: 0.3 })
  })

  it('accepts a custom distribution', () => {
    const result = calculateMacros({
      calorieTarget: 2000,
      strategy: 'custom',
      customDistribution: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    })
    expect(result.grams).toEqual({ protein: 200, carbs: 150, fat: 67 })
  })

  it('throws when strategy is custom but no distribution is provided', () => {
    expect(() => calculateMacros({ calorieTarget: 2000, strategy: 'custom' })).toThrow()
  })

  it('throws when a custom distribution does not sum to 100%', () => {
    expect(() =>
      calculateMacros({
        calorieTarget: 2000,
        strategy: 'custom',
        customDistribution: { protein: 0.5, carbs: 0.5, fat: 0.5 },
      })
    ).toThrow()
  })

  it('throws for a non-positive calorie target', () => {
    expect(() => calculateMacros({ calorieTarget: 0, strategy: 'balanced' })).toThrow()
  })

  it('reports the formula used', () => {
    const result = calculateMacros({ calorieTarget: 2000, strategy: 'balanced' })
    expect(result.formula).toBe('MACRO_DISTRIBUTION')
    expect(result.formulaVersion).toBe('1.0.0')
  })

  // Critical rule: calories reconstructed from the rounded grams must
  // stay within a small rounding-only margin of the calorie target —
  // never drift because a strategy's percentages don't add up.
  describe('calories from grams stay close to the calorie target', () => {
    const predefinedStrategies = MACRO_STRATEGY_VALUES.filter((s) => s !== 'custom')
    const calorieTargets = [1500, 1800, 2000, 2200, 2500, 3000]

    it.each(predefinedStrategies)('holds for the %s strategy', (strategy) => {
      for (const calorieTarget of calorieTargets) {
        const result = calculateMacros({ calorieTarget, strategy })
        expect(Math.abs(result.caloriesFromGrams - calorieTarget)).toBeLessThanOrEqual(10)
      }
    })
  })
})
