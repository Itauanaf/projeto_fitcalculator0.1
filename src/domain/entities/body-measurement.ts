/**
 * A single body measurement captured at a point in time.
 *
 * Weight is intentionally NOT a field on `HealthProfile`: it changes
 * often and each change is meaningful, so it's modeled as a time
 * series of measurements instead. This preserves history like
 * 75kg → 73kg → 71kg → 69kg instead of overwriting it on every edit.
 */
export interface BodyMeasurement {
  id: string
  weightKg: number
  bodyFatPercentage?: number
  measuredAt: Date
}

/**
 * Plausible human bounds, not medical limits. These exist to reject
 * obvious typos/garbage input (e.g. a negative weight, a height
 * pasted into the weight field), not to gate edge-case-but-real bodies.
 */
export const MIN_WEIGHT_KG = 20
export const MAX_WEIGHT_KG = 500

export function isValidWeightKg(weightKg: number): boolean {
  return Number.isFinite(weightKg) && weightKg >= MIN_WEIGHT_KG && weightKg <= MAX_WEIGHT_KG
}

export const MIN_BODY_FAT_PERCENTAGE = 2
export const MAX_BODY_FAT_PERCENTAGE = 70

export function isValidBodyFatPercentage(bodyFatPercentage: number): boolean {
  return (
    Number.isFinite(bodyFatPercentage) &&
    bodyFatPercentage >= MIN_BODY_FAT_PERCENTAGE &&
    bodyFatPercentage <= MAX_BODY_FAT_PERCENTAGE
  )
}

/**
 * Returns the most recent measurement by `measuredAt`, or `null` when
 * there are none yet. Does not mutate the input array.
 */
export function getLatestMeasurement(
  measurements: readonly BodyMeasurement[]
): BodyMeasurement | null {
  if (measurements.length === 0) return null

  return measurements.reduce((latest, current) =>
    current.measuredAt.getTime() > latest.measuredAt.getTime() ? current : latest
  )
}
