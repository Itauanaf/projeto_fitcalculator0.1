import type { MacroStrategy } from '../../value-objects/macro-strategy'

interface MacroValues {
  protein: number
  carbs: number
  fat: number
}

/** Fractions of total calories coming from each macro; must sum to 1. */
export type MacroDistribution = MacroValues

/** Grams of each macro. */
export type MacroGrams = MacroValues

/** Energy density used to convert grams <-> calories (kcal per gram). */
export const CALORIES_PER_GRAM: MacroValues = {
  protein: 4,
  carbs: 4,
  fat: 9,
}

export interface CalculateMacrosInput {
  calorieTarget: number
  strategy: MacroStrategy
  /** Required when `strategy` is `'custom'`; ignored for every other strategy. */
  customDistribution?: MacroDistribution
}

export interface MacroResult {
  calorieTarget: number
  strategy: MacroStrategy
  distribution: MacroDistribution
  grams: MacroGrams
  /**
   * Calories reconstructed from the rounded grams. Should stay within
   * a few kcal of `calorieTarget` — the only allowed drift is
   * per-gram rounding, never a strategy that silently doesn't add up.
   */
  caloriesFromGrams: number
  formula: 'MACRO_DISTRIBUTION'
  formulaVersion: '1.0.0'
}
