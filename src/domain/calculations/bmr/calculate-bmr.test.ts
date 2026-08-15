import { describe, expect, it } from 'vitest'
import { calculateBmr } from './calculate-bmr'

describe('calculateBmr', () => {
  it('matches the reference example for the male formula (70kg, 175cm, 30y)', () => {
    expect(calculateBmr({ weightKg: 70, heightCm: 175, age: 30, sex: 'male' })).toEqual({
      value: 1649,
      unit: 'kcal/day',
      formula: 'MIFFLIN_ST_JEOR',
      formulaVersion: '1.0.0',
    })
  })

  it('uses the female formula (161 offset instead of +5) for the same body', () => {
    expect(calculateBmr({ weightKg: 70, heightCm: 175, age: 30, sex: 'female' })).toEqual({
      value: 1483,
      unit: 'kcal/day',
      formula: 'MIFFLIN_ST_JEOR',
      formulaVersion: '1.0.0',
    })
  })

  it('rounds the result to a whole number of calories', () => {
    const { value } = calculateBmr({ weightKg: 68.3, heightCm: 172, age: 27, sex: 'female' })
    expect(Number.isInteger(value)).toBe(true)
  })

  it('throws for a non-positive weight, height or age', () => {
    expect(() => calculateBmr({ weightKg: 0, heightCm: 175, age: 30, sex: 'male' })).toThrow()
    expect(() => calculateBmr({ weightKg: 70, heightCm: 0, age: 30, sex: 'male' })).toThrow()
    expect(() => calculateBmr({ weightKg: 70, heightCm: 175, age: 0, sex: 'male' })).toThrow()
  })

  it('throws for non-finite inputs', () => {
    expect(() =>
      calculateBmr({ weightKg: Number.NaN, heightCm: 175, age: 30, sex: 'male' })
    ).toThrow()
  })
})
