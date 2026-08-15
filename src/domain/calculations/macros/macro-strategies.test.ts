import { describe, expect, it } from 'vitest'
import { MACRO_STRATEGY_VALUES } from '../../value-objects/macro-strategy'
import { isValidMacroDistribution, MACRO_STRATEGY_DISTRIBUTIONS } from './macro-strategies'

describe('MACRO_STRATEGY_DISTRIBUTIONS', () => {
  it('has a predefined distribution for every strategy except custom', () => {
    const predefinedStrategies = MACRO_STRATEGY_VALUES.filter((s) => s !== 'custom')
    for (const strategy of predefinedStrategies) {
      expect(MACRO_STRATEGY_DISTRIBUTIONS[strategy]).toBeDefined()
    }
  })

  it('has no entry for custom — it always comes from the caller', () => {
    expect('custom' in MACRO_STRATEGY_DISTRIBUTIONS).toBe(false)
  })

  it('sums to 100% for every predefined strategy', () => {
    for (const distribution of Object.values(MACRO_STRATEGY_DISTRIBUTIONS)) {
      expect(isValidMacroDistribution(distribution)).toBe(true)
    }
  })
})

describe('isValidMacroDistribution', () => {
  it('accepts shares that sum to exactly 1', () => {
    expect(isValidMacroDistribution({ protein: 0.25, carbs: 0.45, fat: 0.3 })).toBe(true)
  })

  it('accepts tiny floating-point slack', () => {
    expect(isValidMacroDistribution({ protein: 0.1, carbs: 0.2, fat: 0.7000001 })).toBe(true)
  })

  it('rejects shares that do not sum to 1', () => {
    expect(isValidMacroDistribution({ protein: 0.2, carbs: 0.2, fat: 0.2 })).toBe(false)
    expect(isValidMacroDistribution({ protein: 0.5, carbs: 0.5, fat: 0.5 })).toBe(false)
  })

  it('rejects negative shares', () => {
    expect(isValidMacroDistribution({ protein: -0.1, carbs: 0.6, fat: 0.5 })).toBe(false)
  })

  it('rejects non-finite shares', () => {
    expect(isValidMacroDistribution({ protein: Number.NaN, carbs: 0.5, fat: 0.5 })).toBe(false)
  })
})
