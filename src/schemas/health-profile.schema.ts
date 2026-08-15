import { z } from 'zod'
import { MAX_AGE, MAX_HEIGHT_CM, MIN_AGE, MIN_HEIGHT_CM } from '@/domain/entities/health-profile'
import { ACTIVITY_LEVEL_VALUES } from '@/domain/value-objects/activity-level'
import { GOAL_VALUES } from '@/domain/value-objects/goal'
import { MACRO_STRATEGY_VALUES } from '@/domain/value-objects/macro-strategy'
import { SEX_VALUES } from '@/domain/value-objects/sex'

/**
 * Validates the `/perfil` form. Bounds are imported from the domain
 * (not restated here) so the schema and `isValidAge`/`isValidHeightCm`
 * can never drift apart.
 */
export const healthProfileSchema = z.object({
  age: z
    .number()
    .int('A idade deve ser um número inteiro')
    .min(MIN_AGE, `A idade mínima é ${MIN_AGE} anos`)
    .max(MAX_AGE, `A idade máxima é ${MAX_AGE} anos`),
  heightCm: z
    .number()
    .min(MIN_HEIGHT_CM, `A altura mínima é ${MIN_HEIGHT_CM}cm`)
    .max(MAX_HEIGHT_CM, `A altura máxima é ${MAX_HEIGHT_CM}cm`),
  sex: z.enum(SEX_VALUES, {
    message: 'Selecione o sexo utilizado pela fórmula',
  }),
  activityLevel: z.enum(ACTIVITY_LEVEL_VALUES, {
    message: 'Selecione o nível de atividade',
  }),
  goal: z.enum(GOAL_VALUES, {
    message: 'Selecione seu objetivo',
  }),
  macroStrategy: z.enum(MACRO_STRATEGY_VALUES, {
    message: 'Selecione a estratégia de macros',
  }),
})

export type HealthProfileFormInput = z.infer<typeof healthProfileSchema>
