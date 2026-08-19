import { describe, expect, it } from 'vitest'
import { calculateNextCheckInDate } from './calculate-next-check-in-date'

describe('calculateNextCheckInDate', () => {
  it('adds 7 days for weekly', () => {
    const result = calculateNextCheckInDate('weekly', new Date('2026-08-01T00:00:00.000Z'))
    expect(result?.toISOString()).toBe('2026-08-08T00:00:00.000Z')
  })

  it('adds 15 days for biweekly', () => {
    const result = calculateNextCheckInDate('biweekly', new Date('2026-08-01T00:00:00.000Z'))
    expect(result?.toISOString()).toBe('2026-08-16T00:00:00.000Z')
  })

  it('adds 30 days for monthly', () => {
    const result = calculateNextCheckInDate('monthly', new Date('2026-08-01T00:00:00.000Z'))
    expect(result?.toISOString()).toBe('2026-08-31T00:00:00.000Z')
  })

  it('returns undefined for manual — there is no schedule to compute', () => {
    expect(calculateNextCheckInDate('manual', new Date())).toBeUndefined()
  })

  it('rolls over a month boundary correctly', () => {
    const result = calculateNextCheckInDate('weekly', new Date('2026-08-28T00:00:00.000Z'))
    expect(result?.toISOString()).toBe('2026-09-04T00:00:00.000Z')
  })
})
