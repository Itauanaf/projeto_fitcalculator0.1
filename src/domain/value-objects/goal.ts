/**
 * The user's objective, used to turn a TDEE into a calorie target
 * (deficit, maintenance or surplus).
 */
export const GOAL_VALUES = ['lose_weight', 'maintain', 'gain_weight'] as const

export type Goal = (typeof GOAL_VALUES)[number]
