import type { HealthProfile } from '@/domain/entities/health-profile'
import type { HealthProfileRepository } from '../repositories/health-profile-repository'
import { readJson, removeItem, writeJson } from './local-storage-client'
import { STORAGE_KEYS } from './storage-keys'

export class LocalStorageProfileRepository implements HealthProfileRepository {
  async save(profile: HealthProfile): Promise<void> {
    writeJson(STORAGE_KEYS.profile, profile)
  }

  async find(): Promise<HealthProfile | null> {
    return readJson<HealthProfile>(STORAGE_KEYS.profile)
  }

  async clear(): Promise<void> {
    removeItem(STORAGE_KEYS.profile)
  }
}
