import type { Goal } from '../../value-objects/goal'

/**
 * Default TDEE adjustment per goal, used to prefill the UI when the
 * user hasn't customized it yet. A moderate, sustainable
 * deficit/surplus — not the only valid choice, which is exactly why
 * `calculateCalorieTarget` takes the percentage as input instead of
 * hardcoding it.
 */
export const DEFAULT_ADJUSTMENT_PERCENTAGE: Record<Goal, number> = {
  lose_weight: -20,
  maintain: 0,
  gain_weight: 15,
}
