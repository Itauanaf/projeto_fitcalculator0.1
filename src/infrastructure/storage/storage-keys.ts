/**
 * localStorage keys. Versioned (`.v1`) so a future breaking change to
 * the stored shape can migrate — or start clean under `.v2` — instead
 * of silently misreading data written by an older version.
 */
export const STORAGE_KEYS = {
  profile: 'fitcalculator.profile.v1',
  measurements: 'fitcalculator.measurements.v1',
  calculations: 'fitcalculator.calculations.v1',
} as const
