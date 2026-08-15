import { z } from 'zod'
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG } from '@/domain/entities/body-measurement'
import { healthProfileSchema } from './health-profile.schema'

const DISTRIBUTION_SUM_TOLERANCE = 0.001

const macroDistributionSchema = z
  .object({
    protein: z.number().min(0).max(1),
    carbs: z.number().min(0).max(1),
    fat: z.number().min(0).max(1),
  })
  .refine((d) => Math.abs(d.protein + d.carbs + d.fat - 1) <= DISTRIBUTION_SUM_TOLERANCE, {
    message: 'A soma de proteína, carboidrato e gordura deve fechar em 100%',
  })

/**
 * Validates the standalone `/calculadoras/macros` form: everything
 * `healthProfileSchema` covers, plus weight, plus a custom
 * distribution that's required (and must close to 100%) only when
 * `macroStrategy` is `'custom'`.
 */
export const macrosFormSchema = healthProfileSchema
  .extend({
    weightKg: z
      .number()
      .min(MIN_WEIGHT_KG, `O peso mínimo é ${MIN_WEIGHT_KG}kg`)
      .max(MAX_WEIGHT_KG, `O peso máximo é ${MAX_WEIGHT_KG}kg`),
    customDistribution: macroDistributionSchema.optional(),
  })
  .refine((data) => data.macroStrategy !== 'custom' || data.customDistribution !== undefined, {
    message: 'Informe a distribuição personalizada de macros',
    path: ['customDistribution'],
  })

export type MacrosFormInput = z.infer<typeof macrosFormSchema>
