import { beforeEach, describe, expect, it } from 'vitest'
import type { Calculation } from '@/domain/entities/calculation'
import { LocalStorageCalculationRepository } from './local-storage-calculation.repository'

function calculation(overrides: Partial<Calculation> = {}): Calculation {
  return {
    id: 'calc-1',
    type: 'bmi',
    input: { weightKg: 70, heightCm: 175 },
    result: { bmi: 22.86 },
    formula: 'BMI_WHO',
    formulaVersion: '1.0.0',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('LocalStorageCalculationRepository', () => {
  it('starts empty', async () => {
    const repo = new LocalStorageCalculationRepository()
    expect(await repo.findAll()).toEqual([])
  })

  it('saves and retrieves a calculation', async () => {
    const repo = new LocalStorageCalculationRepository()
    const entry = calculation()
    await repo.save(entry)

    expect(await repo.findAll()).toEqual([entry])
    expect(await repo.findById('calc-1')).toEqual(entry)
  })

  it('returns null for an id that was never saved', async () => {
    const repo = new LocalStorageCalculationRepository()
    expect(await repo.findById('missing')).toBeNull()
  })

  it('overwrites an existing entry with the same id instead of duplicating it', async () => {
    const repo = new LocalStorageCalculationRepository()
    await repo.save(calculation({ result: { bmi: 22.86 } }))
    await repo.save(calculation({ result: { bmi: 23 } }))

    const all = await repo.findAll()
    expect(all).toHaveLength(1)
    expect(all[0].result).toEqual({ bmi: 23 })
  })

  it('deletes an entry by id', async () => {
    const repo = new LocalStorageCalculationRepository()
    await repo.save(calculation({ id: 'a' }))
    await repo.save(calculation({ id: 'b' }))

    await repo.delete('a')

    expect((await repo.findAll()).map((c) => c.id)).toEqual(['b'])
  })
})
