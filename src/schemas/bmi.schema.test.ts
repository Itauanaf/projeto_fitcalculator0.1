import { describe, expect, it } from 'vitest'
import { bmiFormSchema } from './bmi.schema'

describe('bmiFormSchema', () => {
  it('accepts a valid weight and height', () => {
    expect(bmiFormSchema.safeParse({ weightKg: 70, heightCm: 175 }).success).toBe(true)
  })

  it('rejects an out-of-range weight or height', () => {
    expect(bmiFormSchema.safeParse({ weightKg: 0, heightCm: 175 }).success).toBe(false)
    expect(bmiFormSchema.safeParse({ weightKg: 70, heightCm: 0 }).success).toBe(false)
  })

  it('rejects missing fields', () => {
    expect(bmiFormSchema.safeParse({ weightKg: 70 }).success).toBe(false)
  })
})
