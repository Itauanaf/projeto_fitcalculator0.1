import { z } from 'zod'
import { CHECK_IN_FREQUENCY_VALUES } from '@/domain/value-objects/check-in-frequency'

/** Validates the trainer's "frequência de check-in" selector on a student's detail page. */
export const setCheckInFrequencySchema = z.object({
  frequency: z.enum(CHECK_IN_FREQUENCY_VALUES, { message: 'Selecione uma frequência' }),
})

export type SetCheckInFrequencyFormInput = z.infer<typeof setCheckInFrequencySchema>
