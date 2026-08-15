import { describe, expect, it } from 'vitest'
import {
  ACTIVITY_LEVEL_VALUES,
  CALCULATION_TYPE_VALUES,
  GOAL_VALUES,
  MACRO_STRATEGY_VALUES,
  SEX_VALUES,
} from './index'

// These constants are the single source of truth for valid values across
// Zod schemas, calculation modules and UI selects. A typo here would
// silently break lookups (e.g. an activity factor table keyed by these
// exact strings), so pin them explicitly.

describe('SEX_VALUES', () => {
  it('has the exact values the BMR formula branches on', () => {
    expect(SEX_VALUES).toEqual(['male', 'female'])
  })
})

describe('ACTIVITY_LEVEL_VALUES', () => {
  it('has the exact values the TDEE activity factor table keys on', () => {
    expect(ACTIVITY_LEVEL_VALUES).toEqual([
      'sedentary',
      'light',
      'moderate',
      'active',
      'very_active',
    ])
  })
})

describe('GOAL_VALUES', () => {
  it('has the exact values the calorie target step branches on', () => {
    expect(GOAL_VALUES).toEqual(['lose_weight', 'maintain', 'gain_weight'])
  })
})

describe('MACRO_STRATEGY_VALUES', () => {
  it('has the exact values the macro distribution table keys on', () => {
    expect(MACRO_STRATEGY_VALUES).toEqual([
      'balanced',
      'high_protein',
      'low_carb',
      'keto',
      'custom',
    ])
  })
})

describe('CALCULATION_TYPE_VALUES', () => {
  it('has the exact values the history/repository layer keys on', () => {
    expect(CALCULATION_TYPE_VALUES).toEqual(['bmi', 'bmr', 'tdee', 'calorie_target', 'macros'])
  })
})
