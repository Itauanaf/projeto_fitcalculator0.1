import type { Sex } from '../../value-objects/sex'

export interface CalculateBmrInput {
  weightKg: number
  heightCm: number
  age: number
  sex: Sex
}

export interface BmrResult {
  value: number
  unit: 'kcal/day'
  formula: 'MIFFLIN_ST_JEOR'
  formulaVersion: '1.0.0'
}
