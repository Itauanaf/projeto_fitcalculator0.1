import type { CheckInFrequency } from '../../value-objects/check-in-frequency'

const FREQUENCY_DAYS: Record<Exclude<CheckInFrequency, 'manual'>, number> = {
  weekly: 7,
  biweekly: 15,
  monthly: 30,
}

/**
 * When the next check-in should land, counting forward from `from`
 * (normally the check-in that was just submitted, or the day the
 * trainer set the frequency). `manual` has no schedule to compute —
 * the trainer asks for check-ins ad hoc — so this returns `undefined`.
 */
export function calculateNextCheckInDate(
  frequency: CheckInFrequency,
  from: Date
): Date | undefined {
  if (frequency === 'manual') return undefined

  const next = new Date(from)
  next.setUTCDate(next.getUTCDate() + FREQUENCY_DAYS[frequency])
  return next
}
