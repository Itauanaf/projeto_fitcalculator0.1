import { z } from 'zod'
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG } from '@/domain/entities/body-measurement'
import { GOAL_VALUES } from '@/domain/value-objects/goal'

/**
 * Permissive but sane bounds — catches a typo (e.g. -600 instead of
 * -60) without gatekeeping an unusually aggressive but intentional
 * deficit/surplus. See `DEFAULT_ADJUSTMENT_PERCENTAGE` for the values
 * the form prefills per goal type.
 */
export const MIN_CALORIE_ADJUSTMENT_PERCENT = -60
export const MAX_CALORIE_ADJUSTMENT_PERCENT = 60

/** Validates the student dashboard's "set a goal" form. */
export const studentGoalSchema = z.object({
  type: z.enum(GOAL_VALUES, { message: 'Selecione um objetivo' }),
  targetWeightKg: z
    .number()
    .min(MIN_WEIGHT_KG, `O peso mínimo é ${MIN_WEIGHT_KG}kg`)
    .max(MAX_WEIGHT_KG, `O peso máximo é ${MAX_WEIGHT_KG}kg`)
    .optional(),
  /** Informational only — nothing in the calculation engine reads it. */
  targetDate: z
    .union([z.iso.date({ message: 'Informe uma data válida' }), z.literal('')])
    .optional(),
  calorieAdjustmentPercent: z
    .number()
    .min(MIN_CALORIE_ADJUSTMENT_PERCENT, `O ajuste mínimo é ${MIN_CALORIE_ADJUSTMENT_PERCENT}%`)
    .max(MAX_CALORIE_ADJUSTMENT_PERCENT, `O ajuste máximo é ${MAX_CALORIE_ADJUSTMENT_PERCENT}%`),
})

export type StudentGoalFormInput = z.infer<typeof studentGoalSchema>
