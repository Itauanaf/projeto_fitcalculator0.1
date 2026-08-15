import { describe, expect, it } from 'vitest'
import { ACTIVITY_LEVEL_VALUES } from '../../value-objects/activity-level'
import { ACTIVITY_FACTORS } from './activity-factors'

describe('ACTIVITY_FACTORS', () => {
  it('has a factor for every activity level', () => {
    for (const level of ACTIVITY_LEVEL_VALUES) {
      expect(ACTIVITY_FACTORS[level]).toBeTypeOf('number')
    }
  })

  it('increases monotonically with activity', () => {
    const factors = ACTIVITY_LEVEL_VALUES.map((level) => ACTIVITY_FACTORS[level])
    for (let i = 1; i < factors.length; i++) {
      expect(factors[i]).toBeGreaterThan(factors[i - 1])
    }
  })

  it('matches the documented multipliers', () => {
    expect(ACTIVITY_FACTORS).toEqual({
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    })
  })
})
