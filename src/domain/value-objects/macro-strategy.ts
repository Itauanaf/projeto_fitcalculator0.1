/**
 * The macronutrient distribution strategy applied to the calorie
 * target to produce protein/carb/fat grams.
 */
export const MACRO_STRATEGY_VALUES = [
  'balanced',
  'high_protein',
  'low_carb',
  'keto',
  'custom',
] as const

export type MacroStrategy = (typeof MACRO_STRATEGY_VALUES)[number]
