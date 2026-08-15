import type { ActivityLevel } from '../../value-objects/activity-level'
import type { CalculateBmrInput, BmrResult } from '../bmr/bmr.types'

export interface CalculateTdeeInput extends CalculateBmrInput {
  activityLevel: ActivityLevel
}

export interface TdeeResult {
  /** The BMR this TDEE was built on, kept alongside it so the UI can show both without recomputing. */
  bmr: BmrResult
  activityLevel: ActivityLevel
  activityFactor: number
  value: number
  unit: 'kcal/day'
  formula: 'TDEE_ACTIVITY_FACTOR'
  formulaVersion: '1.0.0'
}
