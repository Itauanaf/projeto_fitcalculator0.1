/**
 * Shared rounding helpers so every calculation module (BMI, BMR, TDEE,
 * macros...) rounds the same way instead of each reimplementing it
 * slightly differently.
 */

export function roundTo(value: number, decimalPlaces: number): number {
  const factor = 10 ** decimalPlaces
  return Math.round(value * factor) / factor
}

/** Calorie and gram results are always whole numbers in the UI. */
export function roundToInt(value: number): number {
  return Math.round(value)
}
