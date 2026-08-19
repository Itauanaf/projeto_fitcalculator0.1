import { roundTo, roundToInt } from '../shared/rounding'
import type { CalculateGoalProgressInput, GoalProgressResult } from './goal-progress.types'

/**
 * Turns "started at X, now at Y, aiming for Z" into a 0–100% progress
 * figure — direction-agnostic, so it works the same whether the goal
 * is a deficit (losing weight) or a surplus (gaining weight/muscle).
 * Progress moving the *wrong* way clamps to 0 rather than going
 * negative; overshooting the target clamps to 100 rather than going
 * over.
 */
export function calculateGoalProgress(input: CalculateGoalProgressInput): GoalProgressResult {
  const { initialWeightKg, currentWeightKg, targetWeightKg } = input

  const totalDelta = targetWeightKg - initialWeightKg
  const currentDelta = currentWeightKg - initialWeightKg

  const percent =
    totalDelta === 0
      ? 100
      : roundToInt(Math.min(100, Math.max(0, (currentDelta / totalDelta) * 100)))

  const reached =
    totalDelta <= 0 ? currentWeightKg <= targetWeightKg : currentWeightKg >= targetWeightKg

  return {
    percent,
    deltaFromStartKg: roundTo(currentDelta, 1),
    remainingKg: roundTo(Math.abs(targetWeightKg - currentWeightKg), 1),
    reached,
  }
}
