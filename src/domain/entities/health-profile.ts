import type { ActivityLevel } from '../value-objects/activity-level'
import type { Goal } from '../value-objects/goal'
import type { MacroStrategy } from '../value-objects/macro-strategy'
import type { Sex } from '../value-objects/sex'

/**
 * The user's body profile, shared as input across every calculator
 * (BMI, BMR, TDEE, calorie target, macros).
 *
 * Weight is intentionally NOT part of this profile: it changes over
 * time and is tracked as a `BodyMeasurement` instead, so history isn't
 * lost every time the profile is edited.
 */
export interface HealthProfile {
  age: number
  heightCm: number
  sex: Sex
  activityLevel: ActivityLevel
  goal: Goal
  macroStrategy: MacroStrategy
}
