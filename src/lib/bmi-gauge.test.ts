import { describe, expect, it } from 'vitest'
import { bmiGaugeFraction } from './bmi-gauge'

describe('bmiGaugeFraction', () => {
  it('returns 0 at the bottom of the gauge range', () => {
    expect(bmiGaugeFraction(15)).toBe(0)
  })

  it('returns 1 at the top of the gauge range', () => {
    expect(bmiGaugeFraction(40)).toBe(1)
  })

  it('returns 0.5 at the midpoint', () => {
    expect(bmiGaugeFraction(27.5)).toBeCloseTo(0.5)
  })

  it('clamps a BMI below the range to 0', () => {
    expect(bmiGaugeFraction(10)).toBe(0)
  })

  it('clamps a BMI above the range to 1', () => {
    expect(bmiGaugeFraction(55)).toBe(1)
  })
})
