import type { Calculation } from '@/domain/entities/calculation'

/**
 * Port for persisting calculation history. The domain and application
 * layers depend only on this interface — never on `localStorage`
 * directly — so the backing store can move to a database later
 * without touching a single calculator or page.
 */
export interface CalculationRepository {
  save(calculation: Calculation): Promise<void>
  findAll(): Promise<Calculation[]>
  findById(id: string): Promise<Calculation | null>
  delete(id: string): Promise<void>
}
