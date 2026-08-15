import { describe, expect, it } from 'vitest'
import { roundTo, roundToInt } from './rounding'

describe('roundTo', () => {
  it('rounds to the given number of decimal places', () => {
    expect(roundTo(22.857142857142858, 2)).toBe(22.86)
    expect(roundTo(56.65625, 1)).toBe(56.7)
    expect(roundTo(1.005, 0)).toBe(1)
  })

  it('supports zero decimal places', () => {
    expect(roundTo(1649.4, 0)).toBe(1649)
    expect(roundTo(1649.5, 0)).toBe(1650)
  })
})

describe('roundToInt', () => {
  it('rounds to the nearest whole number', () => {
    expect(roundToInt(2549.5)).toBe(2550)
    expect(roundToInt(2549.4)).toBe(2549)
  })
})
