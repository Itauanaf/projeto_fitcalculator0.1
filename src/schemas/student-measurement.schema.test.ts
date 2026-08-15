import { describe, expect, it } from 'vitest'
import { studentMeasurementSchema } from './student-measurement.schema'

describe('studentMeasurementSchema', () => {
  it('accepts weight alone', () => {
    expect(studentMeasurementSchema.safeParse({ weightKg: 70 }).success).toBe(true)
  })

  it('accepts weight with optional body fat and waist', () => {
    const result = studentMeasurementSchema.safeParse({
      weightKg: 70,
      bodyFatPercentage: 18,
      waistCm: 85,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a weight outside the plausible range', () => {
    expect(studentMeasurementSchema.safeParse({ weightKg: 5 }).success).toBe(false)
  })

  it('rejects a body fat percentage outside the plausible range', () => {
    expect(
      studentMeasurementSchema.safeParse({ weightKg: 70, bodyFatPercentage: 95 }).success
    ).toBe(false)
  })

  it('rejects a waist measurement outside the plausible range', () => {
    expect(studentMeasurementSchema.safeParse({ weightKg: 70, waistCm: 10 }).success).toBe(false)
  })

  it('rejects a missing weight', () => {
    expect(studentMeasurementSchema.safeParse({}).success).toBe(false)
  })
})
