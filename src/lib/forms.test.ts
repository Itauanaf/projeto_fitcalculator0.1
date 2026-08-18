import { describe, expect, it } from 'vitest'
import { asOptionalNumber, emptyToUndefined } from './forms'

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

describe('emptyToUndefined', () => {
  it('returns undefined for an empty string', () => {
    expect(emptyToUndefined('')).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(emptyToUndefined(undefined)).toBeUndefined()
  })

  it('returns a non-empty string unchanged', () => {
    expect(emptyToUndefined('11999998888')).toBe('11999998888')
  })
})
