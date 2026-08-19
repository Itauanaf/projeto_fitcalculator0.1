import { describe, expect, it } from 'vitest'
import { buildStudentTimeline } from './timeline'

const measurement = (id: string, date: string, weightKg: number) => ({
  id,
  weightKg,
  recordedAt: new Date(date),
})

const goal = (
  id: string,
  date: string,
  type: 'lose_weight' | 'maintain',
  calorieAdjustmentPercent = 0
) => ({
  id,
  type,
  calorieAdjustmentPercent,
  status: 'active' as const,
  startedAt: new Date(date),
})

const checkIn = (id: string, measurementId: string, date: string, weightKg: number) => ({
  id,
  measurementId,
  weightKg,
  energyLevel: 4,
  hungerLevel: 2,
  sleepQuality: 4,
  workoutsCompleted: 4,
  nutritionAdherencePercentage: 85,
  submittedAt: new Date(date),
})

describe('buildStudentTimeline', () => {
  it('sorts measurements and goals together, newest first', () => {
    const timeline = buildStudentTimeline(
      [measurement('m1', '2026-08-01', 70), measurement('m2', '2026-08-15', 68)],
      [goal('g1', '2026-08-10', 'lose_weight')]
    )

    expect(timeline.map((e) => e.id)).toEqual(['measurement-m2', 'goal-g1', 'measurement-m1'])
  })

  it('marks a measurement entry with its weight', () => {
    const [entry] = buildStudentTimeline([measurement('m1', '2026-08-01', 70)], [])
    expect(entry.kind).toBe('measurement')
    expect(entry.weightKg).toBe(70)
  })

  it('leaves previousGoalType unset for the first-ever goal', () => {
    const [entry] = buildStudentTimeline([], [goal('g1', '2026-08-01', 'maintain')])
    expect(entry.kind).toBe('goal_started')
    expect(entry.previousGoalType).toBeUndefined()
  })

  it('sets previousGoalType to the goal that came before it', () => {
    const timeline = buildStudentTimeline(
      [],
      [goal('g2', '2026-08-10', 'lose_weight'), goal('g1', '2026-08-01', 'maintain')]
    )
    const changed = timeline.find((e) => e.id === 'goal-g2')
    expect(changed?.previousGoalType).toBe('maintain')
  })

  it('returns an empty timeline for no data', () => {
    expect(buildStudentTimeline([], [])).toEqual([])
  })

  it('represents a check-in once, not also as its underlying measurement', () => {
    const timeline = buildStudentTimeline(
      [measurement('m1', '2026-08-15', 68)],
      [],
      [checkIn('c1', 'm1', '2026-08-15', 68)]
    )

    expect(timeline).toHaveLength(1)
    expect(timeline[0]).toMatchObject({ id: 'check-in-c1', kind: 'check_in', weightKg: 68 })
  })

  it('lists a plain measurement alongside a separate check-in', () => {
    const timeline = buildStudentTimeline(
      [measurement('m1', '2026-08-01', 70), measurement('m2', '2026-08-15', 68)],
      [],
      [checkIn('c1', 'm2', '2026-08-15', 68)]
    )

    expect(timeline.map((e) => e.id)).toEqual(['check-in-c1', 'measurement-m1'])
  })
})
