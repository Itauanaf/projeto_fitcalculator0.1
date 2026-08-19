/**
 * Formats a `Date` as the `YYYY-MM-DD` string an `<input type="date">`
 * expects. Uses UTC getters, not local ones — a bare `YYYY-MM-DD`
 * string parses as UTC midnight (see `student-health-profile.schema.ts`),
 * so reading it back must undo that the same way or the date can drift
 * by a day near the UTC offset boundary.
 */
export function formatDateInput(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Formats a date-only value (birth date, goal target date — anything
 * from a `@db.Date` column) as `DD/MM/YYYY` for display. Also uses UTC
 * getters, for the same reason as `formatDateInput` — `date.toLocaleDateString()`
 * reads local time and would show the day *before* what was entered
 * for anyone in a negative UTC offset (most of Brazil included).
 */
export function formatDateOnly(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${d}/${m}/${y}`
}
