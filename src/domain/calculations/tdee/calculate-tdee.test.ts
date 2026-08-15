import { describe, expect, it } from 'vitest'
import type { ActivityLevel } from '../../value-objects/activity-level'
import { calculateTdee } from './calculate-tdee'

const BASE_INPUT = { weightKg: 70, heightCm: 175, age: 30, sex: 'male' } as const

describe('calculateTdee', () => {
  it('embeds the BMR result it was built from', () => {
    const { bmr } = calculateTdee({ ...BASE_INPUT, activityLevel: 'sedentary' })
    expect(bmr).toEqual({
      value: 1649,
      unit: 'kcal/day',
      formula: 'MIFFLIN_ST_JEOR',
      formulaVersion: '1.0.0',
    })
  })

  it.each([
    ['sedentary', 1979],
    ['light', 2267],
    ['moderate', 2556],
    ['active', 2845],
    ['very_active', 3133],
  ] satisfies [ActivityLevel, number][])(
    'applies the %s activity factor on top of BMR',
    (activityLevel, expectedValue) => {
      const result = calculateTdee({ ...BASE_INPUT, activityLevel })
      expect(result.value).toBe(expectedValue)
      expect(result.activityLevel).toBe(activityLevel)
    }
  )

  it('reports the formula used', () => {
    const result = calculateTdee({ ...BASE_INPUT, activityLevel: 'moderate' })
    expect(result.formula).toBe('TDEE_ACTIVITY_FACTOR')
    expect(result.formulaVersion).toBe('1.0.0')
    expect(result.unit).toBe('kcal/day')
  })

  it('propagates BMR input validation errors', () => {
    expect(() => calculateTdee({ ...BASE_INPUT, weightKg: 0, activityLevel: 'moderate' })).toThrow()
  })

  it('throws for an unsupported activity level', () => {
    expect(() =>
      calculateTdee({ ...BASE_INPUT, activityLevel: 'invalid' as ActivityLevel })
    ).toThrow()
  })
})
