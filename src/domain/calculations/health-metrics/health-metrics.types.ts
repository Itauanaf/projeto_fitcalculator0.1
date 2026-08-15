import type { BodyMeasurement } from '../../entities/body-measurement'
import type { HealthProfile } from '../../entities/health-profile'
import type { BmiResult } from '../bmi/bmi.types'
import type { BmrResult } from '../bmr/bmr.types'
import type { CalorieGoal, CalorieTargetResult } from '../calories/calorie-target.types'
import type { MacroDistribution, MacroResult } from '../macros/macros.types'
import type { TdeeResult } from '../tdee/tdee.types'

export interface CalculateHealthMetricsInput {
  /** Everything BMR/TDEE/macros need from the profile except weight. */
  profile: Pick<HealthProfile, 'age' | 'heightCm' | 'sex' | 'activityLevel' | 'macroStrategy'>
  /** Only the weight feeds into these calculations. */
  measurement: Pick<BodyMeasurement, 'weightKg'>
  goal: CalorieGoal
  /** Required when `profile.macroStrategy` is `'custom'`; ignored otherwise. */
  customMacroDistribution?: MacroDistribution
}

export interface HealthMetricsResult {
  bmi: BmiResult
  bmr: BmrResult
  tdee: TdeeResult
  calorieTarget: CalorieTargetResult
  macros: MacroResult
}
