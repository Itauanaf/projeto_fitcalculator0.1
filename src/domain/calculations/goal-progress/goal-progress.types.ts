export interface CalculateGoalProgressInput {
  initialWeightKg: number
  currentWeightKg: number
  targetWeightKg: number
}

export interface GoalProgressResult {
  /** 0–100, clamped — never negative, never over 100 even if the target was overshot. */
  percent: number
  /** Signed: negative means lost weight since the goal started, positive means gained. */
  deltaFromStartKg: number
  /** Always non-negative — the absolute distance still left to the target. */
  remainingKg: number
  /** True once `currentWeightKg` has reached or passed `targetWeightKg` in the goal's direction. */
  reached: boolean
}
