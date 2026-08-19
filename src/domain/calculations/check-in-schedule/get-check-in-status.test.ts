import { describe, expect, it } from 'vitest'
import { getCheckInStatus } from './get-check-in-status'

const NOW = new Date('2026-08-15T12:00:00.000Z')

describe('getCheckInStatus', () => {
  it('is not_scheduled when there is no next check-in date', () => {
    expect(getCheckInStatus(undefined, NOW)).toEqual({ kind: 'not_scheduled' })
  })

  it('is upcoming when the date is in the future', () => {
    const result = getCheckInStatus(new Date('2026-08-18T12:00:00.000Z'), NOW)
    expect(result).toEqual({ kind: 'upcoming', dueInDays: 3 })
  })

  it('is due when the date is today', () => {
    const result = getCheckInStatus(new Date('2026-08-15T18:00:00.000Z'), NOW)
    expect(result).toEqual({ kind: 'due' })
  })

  it('is overdue when the date has passed', () => {
    const result = getCheckInStatus(new Date('2026-08-12T12:00:00.000Z'), NOW)
    expect(result).toEqual({ kind: 'overdue', daysOverdue: 3 })
  })
})
