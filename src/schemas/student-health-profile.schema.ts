import { z } from 'zod'
import { MAX_AGE, MAX_HEIGHT_CM, MIN_AGE, MIN_HEIGHT_CM } from '@/domain/entities/health-profile'
import { calculateAge } from '@/domain/entities/student-profile'
import { ACTIVITY_LEVEL_VALUES } from '@/domain/value-objects/activity-level'
import { MACRO_STRATEGY_VALUES } from '@/domain/value-objects/macro-strategy'
import { SEX_VALUES } from '@/domain/value-objects/sex'

const DISTRIBUTION_SUM_TOLERANCE = 0.001

/** Same shape/tolerance as the standalone macros calculator's custom distribution — see `macros.schema.ts`. */
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
 * Validates the student dashboard's health-profile form. Collects
 * `birthDate`, not `age` directly — age is always derived from it (see
 * `calculateAge`), so a profile saved today is still accurate next year.
 */
export const studentHealthProfileSchema = z
  .object({
    birthDate: z.iso.date({ message: 'Informe uma data de nascimento válida' }),
    heightCm: z
      .number()
      .min(MIN_HEIGHT_CM, `A altura mínima é ${MIN_HEIGHT_CM}cm`)
      .max(MAX_HEIGHT_CM, `A altura máxima é ${MAX_HEIGHT_CM}cm`),
    sex: z.enum(SEX_VALUES, { message: 'Selecione o sexo utilizado pela fórmula' }),
    activityLevel: z.enum(ACTIVITY_LEVEL_VALUES, { message: 'Selecione o nível de atividade' }),
    macroStrategy: z.enum(MACRO_STRATEGY_VALUES, { message: 'Selecione a estratégia de macros' }),
    customDistribution: macroDistributionSchema.optional(),
  })
  .refine(
    (data) => {
      // A bare `YYYY-MM-DD` string parses as UTC midnight — matching how
      // Postgres's `@db.Date` columns round-trip through Prisma — so this
      // must NOT append a local time suffix, or the two would drift by a
      // day near the UTC offset boundary.
      const age = calculateAge(new Date(data.birthDate))
      return age >= MIN_AGE && age <= MAX_AGE
    },
    { message: `A idade deve estar entre ${MIN_AGE} e ${MAX_AGE} anos`, path: ['birthDate'] }
  )
  .refine((data) => data.macroStrategy !== 'custom' || data.customDistribution !== undefined, {
    message: 'Informe a distribuição personalizada de macros',
    path: ['customDistribution'],
  })

export type StudentHealthProfileFormInput = z.infer<typeof studentHealthProfileSchema>
