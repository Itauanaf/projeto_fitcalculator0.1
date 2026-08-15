import type { MacroStrategy } from '../../value-objects/macro-strategy'
import type { MacroDistribution } from './macros.types'

/**
 * Predefined protein/carb/fat splits (fractions of total calories,
 * summing to 1) per strategy. `custom` has no predefined split — the
 * caller supplies its own `MacroDistribution` instead.
 */
export const MACRO_STRATEGY_DISTRIBUTIONS: Record<
  Exclude<MacroStrategy, 'custom'>,
  MacroDistribution
> = {
  balanced: { protein: 0.25, carbs: 0.45, fat: 0.3 },
  high_protein: { protein: 0.35, carbs: 0.35, fat: 0.3 },
  low_carb: { protein: 0.3, carbs: 0.2, fat: 0.5 },
  keto: { protein: 0.25, carbs: 0.05, fat: 0.7 },
}

const DISTRIBUTION_SUM_TOLERANCE = 0.001

/**
 * A distribution is valid when every share is non-negative and the
 * three shares sum to 1 (allowing floating-point slack, not full
 * percentage points).
 */
export function isValidMacroDistribution(distribution: MacroDistribution): boolean {
  const { protein, carbs, fat } = distribution

  if (![protein, carbs, fat].every((share) => Number.isFinite(share) && share >= 0)) {
    return false
  }

  return Math.abs(protein + carbs + fat - 1) <= DISTRIBUTION_SUM_TOLERANCE
}
