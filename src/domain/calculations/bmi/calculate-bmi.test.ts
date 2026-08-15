import { describe, expect, it } from 'vitest'
import { calculateBmi } from './calculate-bmi'

describe('calculateBmi', () => {
  it('matches the reference example (70kg, 175cm)', () => {
    expect(calculateBmi({ weightKg: 70, heightCm: 175 })).toEqual({
      bmi: 22.86,
      classification: 'normal',
      formula: 'BMI_WHO',
      formulaVersion: '1.0.0',
    })
  })

  it('rounds the bmi to two decimal places', () => {
    const { bmi } = calculateBmi({ weightKg: 60, heightCm: 160 })
    expect(bmi).toBe(23.44)
  })

  it('classifies the result consistently with classifyBmi', () => {
    expect(calculateBmi({ weightKg: 45, heightCm: 170 }).classification).toBe('underweight')
    expect(calculateBmi({ weightKg: 110, heightCm: 170 }).classification).toBe('obese_class_2')
  })

  it('throws for a non-positive weight', () => {
    expect(() => calculateBmi({ weightKg: 0, heightCm: 175 })).toThrow()
    expect(() => calculateBmi({ weightKg: -70, heightCm: 175 })).toThrow()
  })

  it('throws for a non-positive height', () => {
    expect(() => calculateBmi({ weightKg: 70, heightCm: 0 })).toThrow()
    expect(() => calculateBmi({ weightKg: 70, heightCm: -175 })).toThrow()
  })

  it('throws for non-finite inputs', () => {
    expect(() => calculateBmi({ weightKg: Number.NaN, heightCm: 175 })).toThrow()
    expect(() => calculateBmi({ weightKg: 70, heightCm: Number.POSITIVE_INFINITY })).toThrow()
  })
})
