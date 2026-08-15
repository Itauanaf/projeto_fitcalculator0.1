'use server'

import { revalidatePath } from 'next/cache'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { PrismaStudentHealthRepository } from '@/infrastructure/database/prisma/repositories/prisma-student-health.repository'
import {
  studentHealthProfileSchema,
  type StudentHealthProfileFormInput,
} from '@/schemas/student-health-profile.schema'

export interface SaveHealthProfileResult {
  error?: string
}

/**
 * Creates or updates the signed-in student's health profile. Also
 * creates their `student_profiles` row on first save (birth date), since
 * nothing else does — signup only ever creates the shared `profiles` row.
 */
export async function saveHealthProfile(
  input: StudentHealthProfileFormInput
): Promise<SaveHealthProfileResult> {
  const parsed = studentHealthProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const profile = await getCurrentProfile()
  assertRole(profile, ['student'])

  const { birthDate, heightCm, sex, activityLevel, macroStrategy, customDistribution } = parsed.data

  await new PrismaStudentHealthRepository().saveHealthProfile(profile.id, {
    // A bare `YYYY-MM-DD` string parses as UTC midnight, matching how
    // Postgres's `@db.Date` column round-trips through Prisma — see the
    // same note in `student-health-profile.schema.ts`.
    birthDate: new Date(birthDate),
    heightCm,
    sex,
    activityLevel,
    macroStrategy,
    // Stored as 0-100 (matching the `*_percentage` column names); the
    // form and the domain's `MacroDistribution` both use 0-1 fractions.
    customProteinPercentage: customDistribution ? customDistribution.protein * 100 : undefined,
    customCarbsPercentage: customDistribution ? customDistribution.carbs * 100 : undefined,
    customFatPercentage: customDistribution ? customDistribution.fat * 100 : undefined,
  })

  revalidatePath('/app/aluno')
  return {}
}
