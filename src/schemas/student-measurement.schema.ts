import { z } from 'zod'
import {
  MAX_BODY_FAT_PERCENTAGE,
  MAX_WEIGHT_KG,
  MIN_BODY_FAT_PERCENTAGE,
  MIN_WEIGHT_KG,
} from '@/domain/entities/body-measurement'

/**
 * Plausible bounds, not medical limits — same spirit as the domain's
 * weight/body-fat bounds. Waist isn't part of any calculation (no
 * formula in `domain/calculations` reads it), it's tracked purely for
 * the student's own reference, so these bounds live here rather than
 * alongside a domain constant.
 */
export const MIN_WAIST_CM = 30
export const MAX_WAIST_CM = 300

/** Validates the student dashboard's "log a new measurement" form. */
export const studentMeasurementSchema = z.object({
  weightKg: z
    .number()
    .min(MIN_WEIGHT_KG, `O peso mínimo é ${MIN_WEIGHT_KG}kg`)
    .max(MAX_WEIGHT_KG, `O peso máximo é ${MAX_WEIGHT_KG}kg`),
  bodyFatPercentage: z
    .number()
    .min(MIN_BODY_FAT_PERCENTAGE, `O percentual mínimo é ${MIN_BODY_FAT_PERCENTAGE}%`)
    .max(MAX_BODY_FAT_PERCENTAGE, `O percentual máximo é ${MAX_BODY_FAT_PERCENTAGE}%`)
    .optional(),
  waistCm: z
    .number()
    .min(MIN_WAIST_CM, `A cintura mínima é ${MIN_WAIST_CM}cm`)
    .max(MAX_WAIST_CM, `A cintura máxima é ${MAX_WAIST_CM}cm`)
    .optional(),
})

export type StudentMeasurementFormInput = z.infer<typeof studentMeasurementSchema>
