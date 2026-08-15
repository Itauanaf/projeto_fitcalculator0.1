import { describe, expect, it } from 'vitest'
import { calculateAge } from './student-profile'

describe('calculateAge', () => {
  it('returns the age when the birthday already happened this year', () => {
    expect(calculateAge(new Date('2000-01-15'), new Date('2026-06-01'))).toBe(26)
  })

  it('returns one year less when the birthday has not happened yet this year', () => {
    expect(calculateAge(new Date('2000-12-15'), new Date('2026-06-01'))).toBe(25)
  })

  it('counts the birthday itself as already having happened', () => {
    expect(calculateAge(new Date('2000-06-01'), new Date('2026-06-01'))).toBe(26)
  })

  it('handles a leap-day birthday', () => {
    expect(calculateAge(new Date('2000-02-29'), new Date('2026-03-01'))).toBe(26)
    expect(calculateAge(new Date('2000-02-29'), new Date('2026-02-28'))).toBe(25)
  })

  it('defaults to the current date when asOf is omitted', () => {
    const twentyYearsAgo = new Date()
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20)
    expect(calculateAge(twentyYearsAgo)).toBe(20)
  })
})
