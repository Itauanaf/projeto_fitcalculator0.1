/**
 * Physical activity level, used to pick the activity factor applied
 * to BMR when calculating TDEE.
 */
export const ACTIVITY_LEVEL_VALUES = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active',
] as const

export type ActivityLevel = (typeof ACTIVITY_LEVEL_VALUES)[number]
