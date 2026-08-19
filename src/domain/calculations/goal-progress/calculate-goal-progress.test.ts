import { describe, expect, it } from 'vitest'
import { calculateGoalProgress } from './calculate-goal-progress'

describe('calculateGoalProgress', () => {
  it('computes halfway progress for a weight-loss goal', () => {
    const result = calculateGoalProgress({
      initialWeightKg: 75,
      currentWeightKg: 70,
      targetWeightKg: 65,
    })
    expect(result.percent).toBe(50)
    expect(result.deltaFromStartKg).toBe(-5)
    expect(result.remainingKg).toBe(5)
    expect(result.reached).toBe(false)
  })

  it('computes halfway progress for a weight-gain goal', () => {
    const result = calculateGoalProgress({
      initialWeightKg: 65,
      currentWeightKg: 70,
      targetWeightKg: 75,
    })
    expect(result.percent).toBe(50)
    expect(result.deltaFromStartKg).toBe(5)
    expect(result.remainingKg).toBe(5)
    expect(result.reached).toBe(false)
  })

  it('reports 100% and reached once the loss target is met or passed', () => {
    const exact = calculateGoalProgress({
      initialWeightKg: 75,
      currentWeightKg: 65,
      targetWeightKg: 65,
    })
    expect(exact.percent).toBe(100)
    expect(exact.reached).toBe(true)

    const overshot = calculateGoalProgress({
      initialWeightKg: 75,
      currentWeightKg: 60,
      targetWeightKg: 65,
    })
    expect(overshot.percent).toBe(100)
    expect(overshot.reached).toBe(true)
  })

  it('clamps to 0% when weight moves the wrong way', () => {
    const result = calculateGoalProgress({
      initialWeightKg: 75,
      currentWeightKg: 77,
      targetWeightKg: 65,
    })
    expect(result.percent).toBe(0)
    expect(result.reached).toBe(false)
  })

  it('handles a target equal to the starting weight without dividing by zero', () => {
    const result = calculateGoalProgress({
      initialWeightKg: 70,
      currentWeightKg: 70,
      targetWeightKg: 70,
    })
    expect(result.percent).toBe(100)
    expect(Number.isFinite(result.percent)).toBe(true)
  })
})
