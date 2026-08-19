import { describe, expect, it } from 'vitest'
import { calculateStudentStatus } from './calculate-student-status'

describe('calculateStudentStatus', () => {
  it('is active with no flags', () => {
    expect(calculateStudentStatus([])).toBe('active')
  })

  it('is goal_reached when that flag is present, regardless of others', () => {
    expect(
      calculateStudentStatus([{ kind: 'low_adherence', percent: 40 }, { kind: 'goal_reached' }])
    ).toBe('goal_reached')
  })

  it('is no_updates when there is no weight update, even without goal_reached', () => {
    expect(calculateStudentStatus([{ kind: 'no_weight_update', days: 20 }])).toBe('no_updates')
  })

  it('is no_updates when the check-in is overdue', () => {
    expect(calculateStudentStatus([{ kind: 'no_check_in', days: 5 }])).toBe('no_updates')
  })

  it('prefers goal_reached over no_updates when both are present', () => {
    const flags = [
      { kind: 'no_weight_update' as const, days: 20 },
      { kind: 'goal_reached' as const },
    ]
    expect(calculateStudentStatus(flags)).toBe('goal_reached')
  })

  it('is active for flags that are neither goal_reached nor an update problem', () => {
    expect(calculateStudentStatus([{ kind: 'near_goal', percent: 92 }])).toBe('active')
  })
})
