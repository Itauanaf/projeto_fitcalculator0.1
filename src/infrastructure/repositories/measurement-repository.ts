import type { BodyMeasurement } from '@/domain/entities/body-measurement'

/**
 * Port for persisting the weight/body-fat history that
 * `getLatestMeasurement` reads from.
 */
export interface MeasurementRepository {
  save(measurement: BodyMeasurement): Promise<void>
  findAll(): Promise<BodyMeasurement[]>
  findById(id: string): Promise<BodyMeasurement | null>
  delete(id: string): Promise<void>
}
