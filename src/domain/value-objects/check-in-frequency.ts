/**
 * How often a trainer expects a student to check in. `manual` means
 * there's no schedule — the trainer asks for check-ins ad hoc, and
 * `nextCheckInAt` is never computed for it.
 */
export const CHECK_IN_FREQUENCY_VALUES = ['weekly', 'biweekly', 'monthly', 'manual'] as const

export type CheckInFrequency = (typeof CHECK_IN_FREQUENCY_VALUES)[number]
