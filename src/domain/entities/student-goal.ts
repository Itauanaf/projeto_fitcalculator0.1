import type { Goal } from '../value-objects/goal'
import type { GoalStatus } from '../value-objects/goal-status'

/**
 * A goal a student (or their trainer, on their behalf) set at some
 * point. Named `StudentGoal` rather than `Goal` to avoid colliding with
 * the `Goal` value object (`'lose_weight' | 'maintain' | 'gain_weight'`),
 * which this entity's `type` field uses.
 *
 * Ending one goal and starting another is always two writes — end the
 * old one, insert a new one — never an in-place edit of `type`, so the
 * history of what a student was working toward stays intact.
 */
export interface StudentGoal {
  id: string
  studentId: string
  type: Goal
  targetWeightKg?: number
  /** Signed percentage applied to TDEE — see `CalorieGoal.adjustmentPercentage`. */
  calorieAdjustmentPercent: number
  status: GoalStatus
  startedAt: Date
  endedAt?: Date
  /** The student themself, or a trainer acting on their behalf. */
  createdBy: string
  createdAt: Date
  updatedAt: Date
}
