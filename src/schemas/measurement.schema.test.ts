import { describe, expect, it } from 'vitest'
import { bodyMeasurementSchema } from './measurement.schema'

describe('bodyMeasurementSchema', () => {
  it('accepts a weight-only measurement (body fat is optional)', () => {
    expect(bodyMeasurementSchema.safeParse({ weightKg: 70 }).success).toBe(true)
  })

  it('accepts weight with body fat percentage', () => {
    expect(bodyMeasurementSchema.safeParse({ weightKg: 70, bodyFatPercentage: 18 }).success).toBe(
      true
    )
  })

  it('rejects an out-of-range weight', () => {
    expect(bodyMeasurementSchema.safeParse({ weightKg: 1000 }).success).toBe(false)
    expect(bodyMeasurementSchema.safeParse({ weightKg: -5 }).success).toBe(false)
  })

  it('rejects an out-of-range body fat percentage', () => {
    expect(bodyMeasurementSchema.safeParse({ weightKg: 70, bodyFatPercentage: 95 }).success).toBe(
      false
    )
  })

  it('rejects a missing weight', () => {
    expect(bodyMeasurementSchema.safeParse({}).success).toBe(false)
  })
})
