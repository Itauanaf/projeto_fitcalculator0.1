import { z } from 'zod'
import {
  MAX_BODY_FAT_PERCENTAGE,
  MAX_WEIGHT_KG,
  MIN_BODY_FAT_PERCENTAGE,
  MIN_WEIGHT_KG,
} from '@/domain/entities/body-measurement'

/**
 * Validates a new weight/body-fat entry. `id` and `measuredAt` are
 * assigned by the application layer, not collected from the user, so
 * they're intentionally not part of this schema.
 */
export const bodyMeasurementSchema = z.object({
  weightKg: z
    .number()
    .min(MIN_WEIGHT_KG, `O peso mínimo é ${MIN_WEIGHT_KG}kg`)
    .max(MAX_WEIGHT_KG, `O peso máximo é ${MAX_WEIGHT_KG}kg`),
  bodyFatPercentage: z
    .number()
    .min(MIN_BODY_FAT_PERCENTAGE, `O percentual mínimo é ${MIN_BODY_FAT_PERCENTAGE}%`)
    .max(MAX_BODY_FAT_PERCENTAGE, `O percentual máximo é ${MAX_BODY_FAT_PERCENTAGE}%`)
    .optional(),
})

export type BodyMeasurementFormInput = z.infer<typeof bodyMeasurementSchema>
