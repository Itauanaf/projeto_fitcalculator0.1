import { z } from 'zod'

/**
 * Every field is optional — a trainer can use their dashboard without
 * filling any of this in. Plain `.optional()` (no transform to turn
 * `''` into `undefined`) keeps the schema's input and output shapes
 * identical, which is what lets `useForm`'s generic and `zodResolver`
 * agree on a single type; an empty string is normalized to `undefined`
 * where it's persisted instead (`saveTrainerProfile`).
 */
export const trainerProfileSchema = z.object({
  phone: z.string().trim().max(20, 'Máximo de 20 caracteres').optional(),
  /** Professional registration number (CREF, in Brazil) — shown for credibility, never validated against a registry. */
  cref: z.string().trim().max(20, 'Máximo de 20 caracteres').optional(),
  bio: z.string().trim().max(500, 'Máximo de 500 caracteres').optional(),
})

export type TrainerProfileFormInput = z.infer<typeof trainerProfileSchema>
