import { beforeEach, describe, expect, it } from 'vitest'
import type { HealthProfile } from '@/domain/entities/health-profile'
import { LocalStorageProfileRepository } from './local-storage-profile.repository'

const PROFILE: HealthProfile = {
  age: 30,
  heightCm: 175,
  sex: 'male',
  activityLevel: 'moderate',
  goal: 'lose_weight',
  macroStrategy: 'balanced',
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('LocalStorageProfileRepository', () => {
  it('returns null when no profile has been saved', async () => {
    const repo = new LocalStorageProfileRepository()
    expect(await repo.find()).toBeNull()
  })

  it('saves and retrieves the profile', async () => {
    const repo = new LocalStorageProfileRepository()
    await repo.save(PROFILE)
    expect(await repo.find()).toEqual(PROFILE)
  })

  it('overwrites the previous profile on save — there is only ever one', async () => {
    const repo = new LocalStorageProfileRepository()
    await repo.save(PROFILE)
    await repo.save({ ...PROFILE, age: 31 })
    expect((await repo.find())?.age).toBe(31)
  })

  it('clears the stored profile', async () => {
    const repo = new LocalStorageProfileRepository()
    await repo.save(PROFILE)
    await repo.clear()
    expect(await repo.find()).toBeNull()
  })
})
