/**
 * The kind of calculation a `Calculation` history entry records.
 */
export const CALCULATION_TYPE_VALUES = ['bmi', 'bmr', 'tdee', 'calorie_target', 'macros'] as const

export type CalculationType = (typeof CALCULATION_TYPE_VALUES)[number]
