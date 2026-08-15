/** Fields exclusive to a student, keyed by their `Profile.id`. */
export interface StudentProfile {
  userId: string
  /** Stored as a birth date, not a raw age — see `calculateAge`. */
  birthDate: Date
  phone?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Age in whole years as of `asOf` (defaults to now). Ages are always
 * derived from `birthDate` rather than stored directly, so they never
 * drift out of date and no one has to remember to update them yearly.
 */
export function calculateAge(birthDate: Date, asOf: Date = new Date()): number {
  let age = asOf.getFullYear() - birthDate.getFullYear()

  const birthdayHasNotHappenedYetThisYear =
    asOf.getMonth() < birthDate.getMonth() ||
    (asOf.getMonth() === birthDate.getMonth() && asOf.getDate() < birthDate.getDate())

  if (birthdayHasNotHappenedYetThisYear) age -= 1

  return age
}
