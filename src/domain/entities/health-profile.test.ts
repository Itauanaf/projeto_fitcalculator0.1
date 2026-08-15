import { describe, expect, it } from 'vitest'
import {
  isValidAge,
  isValidHeightCm,
  MAX_AGE,
  MAX_HEIGHT_CM,
  MIN_AGE,
  MIN_HEIGHT_CM,
} from './health-profile'

describe('isValidAge', () => {
  it('accepts plausible whole ages', () => {
    expect(isValidAge(30)).toBe(true)
    expect(isValidAge(MIN_AGE)).toBe(true)
    expect(isValidAge(MAX_AGE)).toBe(true)
  })

  it('rejects ages outside the plausible range', () => {
    expect(isValidAge(MIN_AGE - 1)).toBe(false)
    expect(isValidAge(MAX_AGE + 1)).toBe(false)
    expect(isValidAge(0)).toBe(false)
    expect(isValidAge(-5)).toBe(false)
  })

  it('rejects non-integer ages', () => {
    expect(isValidAge(30.5)).toBe(false)
  })
})

describe('isValidHeightCm', () => {
  it('accepts plausible heights', () => {
    expect(isValidHeightCm(175)).toBe(true)
    expect(isValidHeightCm(MIN_HEIGHT_CM)).toBe(true)
    expect(isValidHeightCm(MAX_HEIGHT_CM)).toBe(true)
  })

  it('rejects heights outside the plausible range', () => {
    expect(isValidHeightCm(MIN_HEIGHT_CM - 1)).toBe(false)
    expect(isValidHeightCm(MAX_HEIGHT_CM + 1)).toBe(false)
    expect(isValidHeightCm(0)).toBe(false)
    expect(isValidHeightCm(-175)).toBe(false)
  })

  it('rejects non-finite heights', () => {
    expect(isValidHeightCm(Number.NaN)).toBe(false)
  })
})
