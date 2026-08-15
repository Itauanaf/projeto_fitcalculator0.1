import { beforeEach, describe, expect, it } from 'vitest'
import type { BodyMeasurement } from '@/domain/entities/body-measurement'
import { LocalStorageMeasurementRepository } from './local-storage-measurement.repository'

function measurement(overrides: Partial<BodyMeasurement> = {}): BodyMeasurement {
  return {
    id: 'm-1',
    weightKg: 75,
    measuredAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('LocalStorageMeasurementRepository', () => {
  it('starts empty', async () => {
    const repo = new LocalStorageMeasurementRepository()
    expect(await repo.findAll()).toEqual([])
  })

  it('saves and retrieves a measurement with measuredAt as a real Date', async () => {
    const repo = new LocalStorageMeasurementRepository()
    await repo.save(measurement())

    const [stored] = await repo.findAll()
    expect(stored.measuredAt).toBeInstanceOf(Date)
    expect(stored.measuredAt.toISOString()).toBe('2026-01-01T00:00:00.000Z')
    expect(stored.weightKg).toBe(75)
  })

  it('finds a measurement by id', async () => {
    const repo = new LocalStorageMeasurementRepository()
    await repo.save(measurement({ id: 'm-1' }))
    expect((await repo.findById('m-1'))?.id).toBe('m-1')
    expect(await repo.findById('missing')).toBeNull()
  })

  it('overwrites an existing measurement with the same id instead of duplicating it', async () => {
    const repo = new LocalStorageMeasurementRepository()
    await repo.save(measurement({ weightKg: 75 }))
    await repo.save(measurement({ weightKg: 74 }))

    const all = await repo.findAll()
    expect(all).toHaveLength(1)
    expect(all[0].weightKg).toBe(74)
  })

  it('preserves history across multiple measurements', async () => {
    const repo = new LocalStorageMeasurementRepository()
    await repo.save(measurement({ id: 'm-1', weightKg: 75, measuredAt: new Date('2026-01-01') }))
    await repo.save(measurement({ id: 'm-2', weightKg: 73, measuredAt: new Date('2026-02-01') }))

    const all = await repo.findAll()
    expect(all).toHaveLength(2)
    expect(all.map((m) => m.weightKg).sort()).toEqual([73, 75])
  })

  it('deletes a measurement by id', async () => {
    const repo = new LocalStorageMeasurementRepository()
    await repo.save(measurement({ id: 'a' }))
    await repo.save(measurement({ id: 'b' }))

    await repo.delete('a')

    expect((await repo.findAll()).map((m) => m.id)).toEqual(['b'])
  })
})
