import type { Calculation } from '@/domain/entities/calculation'
import type { CalculationRepository } from '../repositories/calculation-repository'
import { readJson, writeJson } from './local-storage-client'
import { STORAGE_KEYS } from './storage-keys'

export class LocalStorageCalculationRepository implements CalculationRepository {
  async save(calculation: Calculation): Promise<void> {
    const all = await this.findAll()
    const withoutExisting = all.filter((c) => c.id !== calculation.id)
    writeJson(STORAGE_KEYS.calculations, [...withoutExisting, calculation])
  }

  async findAll(): Promise<Calculation[]> {
    return readJson<Calculation[]>(STORAGE_KEYS.calculations) ?? []
  }

  async findById(id: string): Promise<Calculation | null> {
    const all = await this.findAll()
    return all.find((c) => c.id === id) ?? null
  }

  async delete(id: string): Promise<void> {
    const all = await this.findAll()
    writeJson(
      STORAGE_KEYS.calculations,
      all.filter((c) => c.id !== id)
    )
  }
}
