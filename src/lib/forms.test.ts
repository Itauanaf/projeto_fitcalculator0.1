import { describe, expect, it } from 'vitest'
import { asOptionalNumber } from './forms'

describe('asOptionalNumber', () => {
  it('returns undefined for an empty string', () => {
    expect(asOptionalNumber('')).toBeUndefined()
  })

  it('parses a numeric string', () => {
    expect(asOptionalNumber('18.5')).toBe(18.5)
  })

  it('parses a negative numeric string', () => {
    expect(asOptionalNumber('-20')).toBe(-20)
  })
})
