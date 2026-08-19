import { describe, expect, it } from 'vitest'
import { studentCheckInSchema } from './student-check-in.schema'

const VALID_CHECK_IN = {
  weightKg: 70,
  energyLevel: 4,
  hungerLevel: 2,
  sleepQuality: 4,
  workoutsCompleted: 4,
  nutritionAdherencePercentage: 85,
}

describe('studentCheckInSchema', () => {
  it('accepts a fully valid check-in', () => {
    expect(studentCheckInSchema.safeParse(VALID_CHECK_IN).success).toBe(true)
  })

  it('accepts optional notes', () => {
    const result = studentCheckInSchema.safeParse({
      ...VALID_CHECK_IN,
      notes: 'Semana tranquila, consegui seguir bem a rotina.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a rating outside 1-5', () => {
    expect(studentCheckInSchema.safeParse({ ...VALID_CHECK_IN, energyLevel: 0 }).success).toBe(
      false
    )
    expect(studentCheckInSchema.safeParse({ ...VALID_CHECK_IN, sleepQuality: 6 }).success).toBe(
      false
    )
  })

  it('rejects a non-integer rating', () => {
    expect(studentCheckInSchema.safeParse({ ...VALID_CHECK_IN, hungerLevel: 3.5 }).success).toBe(
      false
    )
  })

  it('rejects an adherence percentage outside 0-100', () => {
    const result = studentCheckInSchema.safeParse({
      ...VALID_CHECK_IN,
      nutritionAdherencePercentage: 150,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a negative workout count', () => {
    expect(
      studentCheckInSchema.safeParse({ ...VALID_CHECK_IN, workoutsCompleted: -1 }).success
    ).toBe(false)
  })

  it('rejects a weight outside the plausible range', () => {
    expect(studentCheckInSchema.safeParse({ ...VALID_CHECK_IN, weightKg: 5 }).success).toBe(false)
  })

  it('rejects notes over the length limit', () => {
    const result = studentCheckInSchema.safeParse({ ...VALID_CHECK_IN, notes: 'a'.repeat(1001) })
    expect(result.success).toBe(false)
  })
})
