import { z } from 'zod'
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG } from '@/domain/entities/body-measurement'
import { healthProfileSchema } from './health-profile.schema'

/**
 * Validates the standalone `/calculadoras/tdee` form: the subset of
 * the health profile the BMR/TDEE formulas need, plus weight (which
 * lives outside the profile). Built from `healthProfileSchema`
 * instead of restating age/height/sex/activity bounds.
 */
export const tdeeFormSchema = healthProfileSchema.omit({ goal: true, macroStrategy: true }).extend({
  weightKg: z
    .number()
    .min(MIN_WEIGHT_KG, `O peso mínimo é ${MIN_WEIGHT_KG}kg`)
    .max(MAX_WEIGHT_KG, `O peso máximo é ${MAX_WEIGHT_KG}kg`),
})

export type TdeeFormInput = z.infer<typeof tdeeFormSchema>
