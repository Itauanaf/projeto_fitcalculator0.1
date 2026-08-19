import { z } from 'zod'
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG } from '@/domain/entities/body-measurement'
import {
  MAX_ADHERENCE_PERCENTAGE,
  MAX_RATING,
  MAX_WORKOUTS_COMPLETED,
  MIN_ADHERENCE_PERCENTAGE,
  MIN_RATING,
  MIN_WORKOUTS_COMPLETED,
} from '@/domain/entities/student-check-in'

const ratingField = (label: string) =>
  z
    .number()
    .int(`${label} deve ser um número inteiro`)
    .min(MIN_RATING, `${label} vai de ${MIN_RATING} a ${MAX_RATING}`)
    .max(MAX_RATING, `${label} vai de ${MIN_RATING} a ${MAX_RATING}`)

/** Validates the student dashboard's "fazer check-in" form. */
export const studentCheckInSchema = z.object({
  weightKg: z
    .number()
    .min(MIN_WEIGHT_KG, `O peso mínimo é ${MIN_WEIGHT_KG}kg`)
    .max(MAX_WEIGHT_KG, `O peso máximo é ${MAX_WEIGHT_KG}kg`),
  energyLevel: ratingField('Nível de energia'),
  hungerLevel: ratingField('Nível de fome'),
  sleepQuality: ratingField('Qualidade do sono'),
  workoutsCompleted: z
    .number()
    .int('Treinos realizados deve ser um número inteiro')
    .min(MIN_WORKOUTS_COMPLETED, `O mínimo é ${MIN_WORKOUTS_COMPLETED}`)
    .max(MAX_WORKOUTS_COMPLETED, `O máximo é ${MAX_WORKOUTS_COMPLETED}`),
  nutritionAdherencePercentage: z
    .number()
    .int('Aderência deve ser um número inteiro')
    .min(MIN_ADHERENCE_PERCENTAGE, `O mínimo é ${MIN_ADHERENCE_PERCENTAGE}%`)
    .max(MAX_ADHERENCE_PERCENTAGE, `O máximo é ${MAX_ADHERENCE_PERCENTAGE}%`),
  notes: z.string().trim().max(1000, 'Máximo de 1000 caracteres').optional(),
})

export type StudentCheckInFormInput = z.infer<typeof studentCheckInSchema>
