import { describe, expect, it } from 'vitest'
import { calculateHealthyWeightRange } from './healthy-weight-range'

describe('calculateHealthyWeightRange', () => {
  it('returns the weight range for the WHO normal BMI band at a given height', () => {
    expect(calculateHealthyWeightRange(175)).toEqual({ minKg: 56.7, maxKg: 76.3 })
  })

  it('scales with height', () => {
    const short = calculateHealthyWeightRange(160)
    const tall = calculateHealthyWeightRange(190)
    expect(tall.minKg).toBeGreaterThan(short.minKg)
    expect(tall.maxKg).toBeGreaterThan(short.maxKg)
  })

  it('throws for a non-positive height', () => {
    expect(() => calculateHealthyWeightRange(0)).toThrow()
    expect(() => calculateHealthyWeightRange(-175)).toThrow()
  })
})
