import { describe, expect, it } from 'vitest'
import { studentHealthProfileSchema } from './student-health-profile.schema'

const VALID_PROFILE = {
  birthDate: '1995-06-15',
  heightCm: 175,
  sex: 'male',
  activityLevel: 'moderate',
  macroStrategy: 'balanced',
}

describe('studentHealthProfileSchema', () => {
  it('accepts a fully valid profile', () => {
    expect(studentHealthProfileSchema.safeParse(VALID_PROFILE).success).toBe(true)
  })

  it('rejects a malformed birth date', () => {
    const result = studentHealthProfileSchema.safeParse({
      ...VALID_PROFILE,
      birthDate: '15/06/1995',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a birth date implying an age outside the plausible range', () => {
    const result = studentHealthProfileSchema.safeParse({
      ...VALID_PROFILE,
      birthDate: '2020-01-01',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a height outside the plausible range', () => {
    const result = studentHealthProfileSchema.safeParse({ ...VALID_PROFILE, heightCm: 40 })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown sex, activity level or macro strategy', () => {
    expect(studentHealthProfileSchema.safeParse({ ...VALID_PROFILE, sex: 'other' }).success).toBe(
      false
    )
    expect(
      studentHealthProfileSchema.safeParse({ ...VALID_PROFILE, activityLevel: 'flying' }).success
    ).toBe(false)
    expect(
      studentHealthProfileSchema.safeParse({ ...VALID_PROFILE, macroStrategy: 'carnivore' }).success
    ).toBe(false)
  })

  it('requires a custom distribution when macroStrategy is custom', () => {
    const result = studentHealthProfileSchema.safeParse({
      ...VALID_PROFILE,
      macroStrategy: 'custom',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a custom distribution that does not sum to 100%', () => {
    const result = studentHealthProfileSchema.safeParse({
      ...VALID_PROFILE,
      macroStrategy: 'custom',
      customDistribution: { protein: 0.5, carbs: 0.5, fat: 0.5 },
    })
    expect(result.success).toBe(false)
  })

  it('accepts a custom distribution that sums to 100%', () => {
    const result = studentHealthProfileSchema.safeParse({
      ...VALID_PROFILE,
      macroStrategy: 'custom',
      customDistribution: { protein: 0.3, carbs: 0.5, fat: 0.2 },
    })
    expect(result.success).toBe(true)
  })
})
