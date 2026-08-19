import { describe, expect, it } from 'vitest'
import { formatDateInput, formatDateOnly } from './dates'

describe('formatDateInput', () => {
  it('formats a UTC-midnight date as YYYY-MM-DD', () => {
    expect(formatDateInput(new Date('1995-06-15'))).toBe('1995-06-15')
  })

  it('pads single-digit months and days', () => {
    expect(formatDateInput(new Date('2026-01-05'))).toBe('2026-01-05')
  })

  it('does not drift a day for a date near a negative UTC offset boundary', () => {
    // 1995-06-15T00:00:00.000Z — would render as 1995-06-14 with local getters in any UTC-negative timezone.
    expect(formatDateInput(new Date('1995-06-15T00:00:00.000Z'))).toBe('1995-06-15')
  })
})

describe('formatDateOnly', () => {
  it('formats a UTC-midnight date as DD/MM/YYYY', () => {
    expect(formatDateOnly(new Date('2026-12-31'))).toBe('31/12/2026')
  })

  it('does not drift a day for a date near a negative UTC offset boundary', () => {
    // 2026-12-31T00:00:00.000Z — would render as 30/12/2026 with local getters in any UTC-negative timezone.
    expect(formatDateOnly(new Date('2026-12-31T00:00:00.000Z'))).toBe('31/12/2026')
  })
})
