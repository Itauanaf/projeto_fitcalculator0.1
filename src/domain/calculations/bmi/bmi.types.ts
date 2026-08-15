/**
 * WHO adult BMI classification bands. Not diagnostic — a simple,
 * widely-understood screening bucket, not a statement about health.
 */
export const BMI_CLASSIFICATION_VALUES = [
  'underweight',
  'normal',
  'overweight',
  'obese_class_1',
  'obese_class_2',
  'obese_class_3',
] as const

export type BmiClassification = (typeof BMI_CLASSIFICATION_VALUES)[number]

/**
 * WHO adult BMI bands (kg/m²), shared by `classifyBmi` and
 * `calculateHealthyWeightRange` so the two never drift apart.
 * Each `*Max` is the exclusive upper bound of its band.
 */
export const BMI_BANDS = {
  underweightMax: 18.5,
  normalMax: 25,
  overweightMax: 30,
  obeseClass1Max: 35,
  obeseClass2Max: 40,
} as const

export interface CalculateBmiInput {
  weightKg: number
  heightCm: number
}

export interface BmiResult {
  bmi: number
  classification: BmiClassification
  formula: 'BMI_WHO'
  formulaVersion: '1.0.0'
}

export interface HealthyWeightRange {
  minKg: number
  maxKg: number
}
