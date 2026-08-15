interface MifflinStJeorInput {
  weightKg: number
  heightCm: number
  age: number
}

/**
 * Mifflin-St Jeor BMR formula, male variant (kcal/day, unrounded):
 * 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 */
export function mifflinStJeorMale({ weightKg, heightCm, age }: MifflinStJeorInput): number {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + 5
}

/**
 * Mifflin-St Jeor BMR formula, female variant (kcal/day, unrounded):
 * 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 */
export function mifflinStJeorFemale({ weightKg, heightCm, age }: MifflinStJeorInput): number {
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161
}
