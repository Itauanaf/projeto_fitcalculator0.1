import { describe, expect, it } from 'vitest'
import { studentGoalSchema } from './student-goal.schema'

describe('studentGoalSchema', () => {
  it('accepts a goal without a target weight', () => {
    const result = studentGoalSchema.safeParse({ type: 'maintain', calorieAdjustmentPercent: 0 })
    expect(result.success).toBe(true)
  })

  it('accepts a goal with a target weight', () => {
    const result = studentGoalSchema.safeParse({
      type: 'lose_weight',
      targetWeightKg: 68,
      calorieAdjustmentPercent: -20,
    })
    expect(result.success).toBe(true)
  })

  it('rejects an unknown goal type', () => {
    const result = studentGoalSchema.safeParse({ type: 'bulk', calorieAdjustmentPercent: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects a calorie adjustment outside the plausible range', () => {
    const result = studentGoalSchema.safeParse({
      type: 'lose_weight',
      calorieAdjustmentPercent: -90,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a target weight outside the plausible range', () => {
    const result = studentGoalSchema.safeParse({
      type: 'lose_weight',
      targetWeightKg: 5,
      calorieAdjustmentPercent: -20,
    })
    expect(result.success).toBe(false)
  })
})
