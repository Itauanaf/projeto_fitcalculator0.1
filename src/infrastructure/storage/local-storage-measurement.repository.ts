import type { BodyMeasurement } from '@/domain/entities/body-measurement'
import type { MeasurementRepository } from '../repositories/measurement-repository'
import { readJson, writeJson } from './local-storage-client'
import { STORAGE_KEYS } from './storage-keys'

/** `measuredAt` round-trips through JSON as a string; this is the shape actually sitting in localStorage. */
type StoredBodyMeasurement = Omit<BodyMeasurement, 'measuredAt'> & { measuredAt: string }

export class LocalStorageMeasurementRepository implements MeasurementRepository {
  async save(measurement: BodyMeasurement): Promise<void> {
    const stored = await this.readAllStored()
    const withoutExisting = stored.filter((m) => m.id !== measurement.id)
    writeJson(STORAGE_KEYS.measurements, [
      ...withoutExisting,
      { ...measurement, measuredAt: measurement.measuredAt.toISOString() },
    ])
  }

  async findAll(): Promise<BodyMeasurement[]> {
    const stored = await this.readAllStored()
    return stored.map(toDomain)
  }

  async findById(id: string): Promise<BodyMeasurement | null> {
    const all = await this.findAll()
    return all.find((m) => m.id === id) ?? null
  }

  async delete(id: string): Promise<void> {
    const stored = await this.readAllStored()
    writeJson(
      STORAGE_KEYS.measurements,
      stored.filter((m) => m.id !== id)
    )
  }

  private async readAllStored(): Promise<StoredBodyMeasurement[]> {
    return readJson<StoredBodyMeasurement[]>(STORAGE_KEYS.measurements) ?? []
  }
}

function toDomain(stored: StoredBodyMeasurement): BodyMeasurement {
  return { ...stored, measuredAt: new Date(stored.measuredAt) }
}
