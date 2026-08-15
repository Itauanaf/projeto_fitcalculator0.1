import type { ActivityLevel } from '../../value-objects/activity-level'

/**
 * Multiplier applied to BMR to estimate total daily energy
 * expenditure, based on self-reported activity level. `Record` over
 * the full `ActivityLevel` union so a missing key is a compile error,
 * not a silent `undefined` at runtime.
 */
export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}
