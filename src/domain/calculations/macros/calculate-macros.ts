import { roundToInt } from '../shared/rounding'
import { isValidMacroDistribution, MACRO_STRATEGY_DISTRIBUTIONS } from './macro-strategies'
import { CALORIES_PER_GRAM } from './macros.types'
import type { CalculateMacrosInput, MacroDistribution, MacroResult } from './macros.types'

const FORMULA = 'MACRO_DISTRIBUTION' as const
const FORMULA_VERSION = '1.0.0' as const

/**
 * Turns a calorie target into protein/carb/fat grams. Always driven
 * by `calorieTarget` + `strategy` from the caller — never hardcodes a
 * body profile or a fixed calorie number internally, which is what
 * made the previous macro calculator wrong.
 */
export function calculateMacros(input: CalculateMacrosInput): MacroResult {
  const { calorieTarget, strategy, customDistribution } = input

  if (!Number.isFinite(calorieTarget) || calorieTarget <= 0) {
    throw new Error('calculateMacros: calorieTarget must be a positive, finite number')
  }

  const distribution = resolveDistribution(strategy, customDistribution)

  if (!isValidMacroDistribution(distribution)) {
    throw new Error('calculateMacros: distribution shares must be non-negative and sum to 100%')
  }

  const grams = {
    protein: roundToInt((calorieTarget * distribution.protein) / CALORIES_PER_GRAM.protein),
    carbs: roundToInt((calorieTarget * distribution.carbs) / CALORIES_PER_GRAM.carbs),
    fat: roundToInt((calorieTarget * distribution.fat) / CALORIES_PER_GRAM.fat),
  }

  const caloriesFromGrams =
    grams.protein * CALORIES_PER_GRAM.protein +
    grams.carbs * CALORIES_PER_GRAM.carbs +
    grams.fat * CALORIES_PER_GRAM.fat

  return {
    calorieTarget,
    strategy,
    distribution,
    grams,
    caloriesFromGrams,
    formula: FORMULA,
    formulaVersion: FORMULA_VERSION,
  }
}

function resolveDistribution(
  strategy: CalculateMacrosInput['strategy'],
  customDistribution: MacroDistribution | undefined
): MacroDistribution {
  if (strategy === 'custom') {
    if (!customDistribution) {
      throw new Error('calculateMacros: customDistribution is required when strategy is "custom"')
    }
    return customDistribution
  }
  return MACRO_STRATEGY_DISTRIBUTIONS[strategy]
}
