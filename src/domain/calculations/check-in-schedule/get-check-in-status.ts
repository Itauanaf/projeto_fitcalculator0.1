import type { CheckInStatus } from './check-in-schedule.types'

const DAY_MS = 24 * 60 * 60 * 1000

/** Midnight UTC of the given date's calendar day — so "today" compares by date, not by exact instant. */
function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

/**
 * Turns a scheduled `nextCheckInAt` into a status the dashboard can
 * render directly — "disponível", "em X dias", or "atrasado há X dias".
 * Compares calendar days (not exact instants), so a check-in scheduled
 * for any time today reads as `due`, not `upcoming` by a few hours or
 * `overdue` by a few hours. `undefined` (a `manual`-frequency student,
 * or one with no schedule yet) is `not_scheduled`, not an error.
 */
export function getCheckInStatus(
  nextCheckInAt: Date | undefined,
  asOf: Date = new Date()
): CheckInStatus {
  if (!nextCheckInAt) return { kind: 'not_scheduled' }

  const diffDays = Math.round((startOfUtcDay(nextCheckInAt) - startOfUtcDay(asOf)) / DAY_MS)

  if (diffDays > 0) return { kind: 'upcoming', dueInDays: diffDays }
  if (diffDays === 0) return { kind: 'due' }
  return { kind: 'overdue', daysOverdue: Math.abs(diffDays) }
}
