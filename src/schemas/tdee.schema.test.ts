import { describe, expect, it } from 'vitest'
import { tdeeFormSchema } from './tdee.schema'

const VALID_INPUT = {
  weightKg: 70,
  age: 30,
  heightCm: 175,
  sex: 'male',
  activityLevel: 'moderate',
}

describe('tdeeFormSchema', () => {
  it('accepts a valid input', () => {
    expect(tdeeFormSchema.safeParse(VALID_INPUT).success).toBe(true)
  })

  it('does not require goal or macroStrategy — those belong to the profile/macros forms', () => {
    const result = tdeeFormSchema.safeParse(VALID_INPUT)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('goal')
      expect(result.data).not.toHaveProperty('macroStrategy')
    }
  })

  it('rejects an out-of-range weight', () => {
    expect(tdeeFormSchema.safeParse({ ...VALID_INPUT, weightKg: 0 }).success).toBe(false)
  })

  it('reuses the health profile bounds for age and height', () => {
    expect(tdeeFormSchema.safeParse({ ...VALID_INPUT, age: 5 }).success).toBe(false)
    expect(tdeeFormSchema.safeParse({ ...VALID_INPUT, heightCm: 40 }).success).toBe(false)
  })
})
