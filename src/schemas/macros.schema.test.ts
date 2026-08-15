import { describe, expect, it } from 'vitest'
import { macrosFormSchema } from './macros.schema'

const BASE_INPUT = {
  weightKg: 70,
  age: 30,
  heightCm: 175,
  sex: 'male',
  activityLevel: 'moderate',
  goal: 'lose_weight',
}

describe('macrosFormSchema', () => {
  it('accepts a predefined strategy without a custom distribution', () => {
    const result = macrosFormSchema.safeParse({ ...BASE_INPUT, macroStrategy: 'balanced' })
    expect(result.success).toBe(true)
  })

  it('accepts the custom strategy with a distribution that sums to 100%', () => {
    const result = macrosFormSchema.safeParse({
      ...BASE_INPUT,
      macroStrategy: 'custom',
      customDistribution: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    })
    expect(result.success).toBe(true)
  })

  it('rejects the custom strategy without a distribution', () => {
    const result = macrosFormSchema.safeParse({ ...BASE_INPUT, macroStrategy: 'custom' })
    expect(result.success).toBe(false)
  })

  it('rejects a custom distribution that does not sum to 100%', () => {
    const result = macrosFormSchema.safeParse({
      ...BASE_INPUT,
      macroStrategy: 'custom',
      customDistribution: { protein: 0.5, carbs: 0.5, fat: 0.5 },
    })
    expect(result.success).toBe(false)
  })

  it('does not require macroStrategy to be "custom" for a valid customDistribution to be accepted', () => {
    const result = macrosFormSchema.safeParse({
      ...BASE_INPUT,
      macroStrategy: 'balanced',
      customDistribution: { protein: 0.3, carbs: 0.3, fat: 0.4 },
    })
    expect(result.success).toBe(true)
  })
})
