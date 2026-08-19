/**
 * The user's objective, used to turn a TDEE into a calorie target
 * (deficit, maintenance or surplus). `gain_weight` and `gain_muscle`
 * are deliberately separate — the same direction (surplus) but a
 * different intent, and fitness-tracking users expect to distinguish
 * "bulking" from generic weight gain.
 */
export const GOAL_VALUES = ['lose_weight', 'maintain', 'gain_weight', 'gain_muscle'] as const

export type Goal = (typeof GOAL_VALUES)[number]
