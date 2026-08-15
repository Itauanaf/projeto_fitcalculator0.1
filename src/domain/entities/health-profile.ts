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

/**
 * Plausible bounds, not hard biological limits — reject obvious
 * typos/garbage (e.g. an age of 0 or 900) without gatekeeping real
 * but unusual bodies. The BMR/TDEE formulas are also calibrated for
 * this range and get less reliable outside it.
 */
export const MIN_AGE = 15
export const MAX_AGE = 120

export function isValidAge(age: number): boolean {
  return Number.isInteger(age) && age >= MIN_AGE && age <= MAX_AGE
}

export const MIN_HEIGHT_CM = 100
export const MAX_HEIGHT_CM = 250

export function isValidHeightCm(heightCm: number): boolean {
  return Number.isFinite(heightCm) && heightCm >= MIN_HEIGHT_CM && heightCm <= MAX_HEIGHT_CM
}
