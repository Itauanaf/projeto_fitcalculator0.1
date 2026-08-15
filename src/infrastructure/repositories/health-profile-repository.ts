import type { HealthProfile } from '@/domain/entities/health-profile'

/**
 * Port for persisting the single body profile shared across
 * calculators. Unlike measurements/calculations there is at most one
 * profile at a time, so this is a get/save/clear slot rather than a
 * list.
 */
export interface HealthProfileRepository {
  save(profile: HealthProfile): Promise<void>
  find(): Promise<HealthProfile | null>
  clear(): Promise<void>
}
