import { BMI_BANDS, type BmiClassification } from './bmi.types'

export function classifyBmi(bmi: number): BmiClassification {
  if (bmi < BMI_BANDS.underweightMax) return 'underweight'
  if (bmi < BMI_BANDS.normalMax) return 'normal'
  if (bmi < BMI_BANDS.overweightMax) return 'overweight'
  if (bmi < BMI_BANDS.obeseClass1Max) return 'obese_class_1'
  if (bmi < BMI_BANDS.obeseClass2Max) return 'obese_class_2'
  return 'obese_class_3'
}
