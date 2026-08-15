import { describe, expect, it } from 'vitest'
import { healthProfileSchema } from './health-profile.schema'

const VALID_PROFILE = {
  age: 30,
  heightCm: 175,
  sex: 'male',
  activityLevel: 'moderate',
  goal: 'lose_weight',
  macroStrategy: 'balanced',
}

describe('healthProfileSchema', () => {
  it('accepts a fully valid profile', () => {
    expect(healthProfileSchema.safeParse(VALID_PROFILE).success).toBe(true)
  })

  it('rejects an age outside the plausible range', () => {
    const result = healthProfileSchema.safeParse({ ...VALID_PROFILE, age: 5 })
    expect(result.success).toBe(false)
  })

  it('rejects a non-integer age', () => {
    const result = healthProfileSchema.safeParse({ ...VALID_PROFILE, age: 30.5 })
    expect(result.success).toBe(false)
  })

  it('rejects a height outside the plausible range', () => {
    const result = healthProfileSchema.safeParse({ ...VALID_PROFILE, heightCm: 40 })
    expect(result.success).toBe(false)
  })

  it('rejects a sex value not used by the formulas', () => {
    const result = healthProfileSchema.safeParse({ ...VALID_PROFILE, sex: 'other' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown activity level, goal or macro strategy', () => {
    expect(
      healthProfileSchema.safeParse({ ...VALID_PROFILE, activityLevel: 'flying' }).success
    ).toBe(false)
    expect(healthProfileSchema.safeParse({ ...VALID_PROFILE, goal: 'bulk' }).success).toBe(false)
    expect(
      healthProfileSchema.safeParse({ ...VALID_PROFILE, macroStrategy: 'carnivore' }).success
    ).toBe(false)
  })

  it('rejects missing required fields', () => {
    const withoutAge: Partial<typeof VALID_PROFILE> = { ...VALID_PROFILE }
    delete withoutAge.age
    expect(healthProfileSchema.safeParse(withoutAge).success).toBe(false)
  })
})
