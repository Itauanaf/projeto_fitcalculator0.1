import { describe, expect, it } from 'vitest'
import {
  ACTIVITY_LEVEL_VALUES,
  CALCULATION_TYPE_VALUES,
  GOAL_STATUS_VALUES,
  GOAL_VALUES,
  INVITATION_STATUS_VALUES,
  MACRO_STRATEGY_VALUES,
  RELATIONSHIP_STATUS_VALUES,
  SEX_VALUES,
  USER_ROLE_VALUES,
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

describe('USER_ROLE_VALUES', () => {
  it('has the exact values the dashboard redirect and authorization layer branch on', () => {
    expect(USER_ROLE_VALUES).toEqual(['student', 'trainer', 'admin'])
  })
})

describe('GOAL_STATUS_VALUES', () => {
  it('has the exact values a goal lifecycle can be in', () => {
    expect(GOAL_STATUS_VALUES).toEqual(['active', 'completed', 'cancelled'])
  })
})

describe('RELATIONSHIP_STATUS_VALUES', () => {
  it('has the exact values a trainer-student link can be in', () => {
    expect(RELATIONSHIP_STATUS_VALUES).toEqual(['pending', 'active', 'inactive'])
  })
})

describe('INVITATION_STATUS_VALUES', () => {
  it('has the exact values a student invitation can be in', () => {
    expect(INVITATION_STATUS_VALUES).toEqual(['pending', 'accepted', 'expired', 'cancelled'])
  })
})
