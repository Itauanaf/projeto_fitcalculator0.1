import { z } from 'zod'
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG } from '@/domain/entities/body-measurement'
import { MAX_HEIGHT_CM, MIN_HEIGHT_CM } from '@/domain/entities/health-profile'

/** Validates the standalone `/calculadoras/imc` form. */
export const bmiFormSchema = z.object({
  weightKg: z
    .number()
    .min(MIN_WEIGHT_KG, `O peso mínimo é ${MIN_WEIGHT_KG}kg`)
    .max(MAX_WEIGHT_KG, `O peso máximo é ${MAX_WEIGHT_KG}kg`),
  heightCm: z
    .number()
    .min(MIN_HEIGHT_CM, `A altura mínima é ${MIN_HEIGHT_CM}cm`)
    .max(MAX_HEIGHT_CM, `A altura máxima é ${MAX_HEIGHT_CM}cm`),
})

export type BmiFormInput = z.infer<typeof bmiFormSchema>
