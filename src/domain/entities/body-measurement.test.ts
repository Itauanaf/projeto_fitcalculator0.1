import { describe, expect, it } from 'vitest'
import {
  getLatestMeasurement,
  isValidBodyFatPercentage,
  isValidWeightKg,
  MAX_BODY_FAT_PERCENTAGE,
  MAX_WEIGHT_KG,
  MIN_BODY_FAT_PERCENTAGE,
  MIN_WEIGHT_KG,
  type BodyMeasurement,
} from './body-measurement'

describe('isValidWeightKg', () => {
  it('accepts plausible weights', () => {
    expect(isValidWeightKg(70)).toBe(true)
    expect(isValidWeightKg(MIN_WEIGHT_KG)).toBe(true)
    expect(isValidWeightKg(MAX_WEIGHT_KG)).toBe(true)
  })

  it('rejects zero, negative and out-of-range weights', () => {
    expect(isValidWeightKg(0)).toBe(false)
    expect(isValidWeightKg(-70)).toBe(false)
    expect(isValidWeightKg(MIN_WEIGHT_KG - 0.1)).toBe(false)
    expect(isValidWeightKg(MAX_WEIGHT_KG + 0.1)).toBe(false)
  })

  it('rejects non-finite values', () => {
    expect(isValidWeightKg(Number.NaN)).toBe(false)
    expect(isValidWeightKg(Number.POSITIVE_INFINITY)).toBe(false)
  })
})

describe('isValidBodyFatPercentage', () => {
  it('accepts plausible percentages', () => {
    expect(isValidBodyFatPercentage(20)).toBe(true)
    expect(isValidBodyFatPercentage(MIN_BODY_FAT_PERCENTAGE)).toBe(true)
    expect(isValidBodyFatPercentage(MAX_BODY_FAT_PERCENTAGE)).toBe(true)
  })

  it('rejects out-of-range percentages', () => {
    expect(isValidBodyFatPercentage(MIN_BODY_FAT_PERCENTAGE - 0.1)).toBe(false)
    expect(isValidBodyFatPercentage(MAX_BODY_FAT_PERCENTAGE + 0.1)).toBe(false)
    expect(isValidBodyFatPercentage(-5)).toBe(false)
  })

  it('rejects non-finite values', () => {
    expect(isValidBodyFatPercentage(Number.NaN)).toBe(false)
  })
})

describe('getLatestMeasurement', () => {
  function measurement(measuredAt: string, weightKg = 70): BodyMeasurement {
    return { id: measuredAt, weightKg, measuredAt: new Date(measuredAt) }
  }

  it('returns null for an empty list', () => {
    expect(getLatestMeasurement([])).toBeNull()
  })

  it('returns the single measurement when there is only one', () => {
    const only = measurement('2026-01-01')
    expect(getLatestMeasurement([only])).toBe(only)
  })

  it('returns the most recent measurement regardless of input order', () => {
    const oldest = measurement('2026-01-01', 75)
    const middle = measurement('2026-02-01', 73)
    const newest = measurement('2026-03-01', 71)

    expect(getLatestMeasurement([oldest, newest, middle])).toBe(newest)
    expect(getLatestMeasurement([newest, middle, oldest])).toBe(newest)
  })

  it('does not mutate the input array', () => {
    const list = [measurement('2026-03-01'), measurement('2026-01-01')]
    const copy = [...list]
    getLatestMeasurement(list)
    expect(list).toEqual(copy)
  })
})
