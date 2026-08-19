import { describe, expect, it } from 'vitest'
import { detectAttentionFlags } from './detect-attention-flags'

const NOW = new Date('2026-08-19T12:00:00.000Z')
const daysAgo = (days: number) => new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000)

describe('detectAttentionFlags', () => {
  it('flags an incomplete profile', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: false,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [],
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags).toContainEqual({ kind: 'incomplete_profile' })
  })

  it('flags an overdue check-in with the number of days late', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'overdue', daysOverdue: 14 },
      measurements: [],
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags).toContainEqual({ kind: 'no_check_in', days: 14 })
  })

  it('does not flag a check-in that is merely upcoming or due', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'due' },
      measurements: [],
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags.some((f) => f.kind === 'no_check_in')).toBe(false)
  })

  it('flags no weight update once the latest measurement is 14+ days old', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [{ weightKg: 80, recordedAt: daysAgo(15) }],
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags).toContainEqual({ kind: 'no_weight_update', days: 15 })
  })

  it('does not flag a recent measurement', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [{ weightKg: 80, recordedAt: daysAgo(2) }],
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags.some((f) => f.kind === 'no_weight_update')).toBe(false)
  })

  it('flags a significant weight swing within the 7-day window', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [
        { weightKg: 76.8, recordedAt: daysAgo(1) },
        { weightKg: 80, recordedAt: daysAgo(6) },
      ],
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags).toContainEqual({ kind: 'weight_change', weightChangeKg: -3.2, days: 7 })
  })

  it('does not flag a small weight change', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [
        { weightKg: 79.5, recordedAt: daysAgo(1) },
        { weightKg: 80, recordedAt: daysAgo(6) },
      ],
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags.some((f) => f.kind === 'weight_change')).toBe(false)
  })

  it('ignores measurements outside the weight-change window', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [
        { weightKg: 76, recordedAt: daysAgo(1) },
        { weightKg: 80, recordedAt: daysAgo(30) },
      ],
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags.some((f) => f.kind === 'weight_change')).toBe(false)
  })

  it('flags a reached goal', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [],
      goalProgress: { percent: 100, deltaFromStartKg: -7, remainingKg: 0, reached: true },
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags).toContainEqual({ kind: 'goal_reached' })
  })

  it('flags a near-but-unreached goal', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [],
      goalProgress: { percent: 92, deltaFromStartKg: -6.4, remainingKg: 0.6, reached: false },
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags).toContainEqual({ kind: 'near_goal', percent: 92 })
  })

  it('does not flag goal_reached and near_goal together', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [],
      goalProgress: { percent: 100, deltaFromStartKg: -7, remainingKg: 0, reached: true },
      recentAdherencePercentages: [],
      asOf: NOW,
    })
    expect(flags.some((f) => f.kind === 'near_goal')).toBe(false)
  })

  it('flags recurring low adherence across the last two check-ins', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [],
      recentAdherencePercentages: [40, 50, 90],
      asOf: NOW,
    })
    expect(flags).toContainEqual({ kind: 'low_adherence', percent: 45 })
  })

  it('does not flag a single low check-in among otherwise good ones', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'not_scheduled' },
      measurements: [],
      recentAdherencePercentages: [40, 85],
      asOf: NOW,
    })
    expect(flags.some((f) => f.kind === 'low_adherence')).toBe(false)
  })

  it('returns no flags for a healthy, up-to-date, on-track student', () => {
    const flags = detectAttentionFlags({
      hasHealthProfile: true,
      checkInStatus: { kind: 'upcoming', dueInDays: 3 },
      measurements: [{ weightKg: 78, recordedAt: daysAgo(1) }],
      goalProgress: { percent: 40, deltaFromStartKg: -2, remainingKg: 3, reached: false },
      recentAdherencePercentages: [85, 90],
      asOf: NOW,
    })
    expect(flags).toEqual([])
  })
})
