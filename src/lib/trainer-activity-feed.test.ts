import { describe, expect, it } from 'vitest'
import { buildTrainerActivityFeed } from './trainer-activity-feed'

describe('buildTrainerActivityFeed', () => {
  it('merges and sorts activity across students, newest first', () => {
    const feed = buildTrainerActivityFeed([
      {
        studentId: 's1',
        fullName: 'Ana',
        measurements: [{ id: 'm1', weightKg: 68.4, recordedAt: new Date('2026-08-19T10:00:00Z') }],
        checkIns: [],
        goals: [],
      },
      {
        studentId: 's2',
        fullName: 'Carlos',
        measurements: [],
        checkIns: [
          {
            id: 'c1',
            measurementId: 'm2',
            weightKg: 80,
            submittedAt: new Date('2026-08-19T09:00:00Z'),
          },
        ],
        goals: [],
      },
    ])

    expect(feed.map((e) => e.id)).toEqual(['measurement-m1', 'check-in-c1'])
    expect(feed[0]).toMatchObject({ studentName: 'Ana', kind: 'measurement', weightKg: 68.4 })
    expect(feed[1]).toMatchObject({ studentName: 'Carlos', kind: 'check_in' })
  })

  it('does not list a check-in measurement a second time as a plain measurement', () => {
    const feed = buildTrainerActivityFeed([
      {
        studentId: 's1',
        fullName: 'Ana',
        measurements: [{ id: 'm1', weightKg: 68, recordedAt: new Date('2026-08-19T10:00:00Z') }],
        checkIns: [
          {
            id: 'c1',
            measurementId: 'm1',
            weightKg: 68,
            submittedAt: new Date('2026-08-19T10:00:00Z'),
          },
        ],
        goals: [],
      },
    ])

    expect(feed).toHaveLength(1)
    expect(feed[0].id).toBe('check-in-c1')
  })

  it('includes goal changes', () => {
    const feed = buildTrainerActivityFeed([
      {
        studentId: 's1',
        fullName: 'João',
        measurements: [],
        checkIns: [],
        goals: [{ id: 'g1', type: 'lose_weight', startedAt: new Date('2026-08-17T10:00:00Z') }],
      },
    ])

    expect(feed[0]).toMatchObject({
      kind: 'goal_changed',
      studentName: 'João',
      goalType: 'lose_weight',
    })
  })

  it('caps the feed to the given limit', () => {
    const measurements = Array.from({ length: 20 }, (_, i) => ({
      id: `m${i}`,
      weightKg: 70,
      recordedAt: new Date(2026, 7, i + 1),
    }))
    const feed = buildTrainerActivityFeed(
      [{ studentId: 's1', fullName: 'Ana', measurements, checkIns: [], goals: [] }],
      5
    )
    expect(feed).toHaveLength(5)
  })

  it('returns an empty feed for no students', () => {
    expect(buildTrainerActivityFeed([])).toEqual([])
  })
})
