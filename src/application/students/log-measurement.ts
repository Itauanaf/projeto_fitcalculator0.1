'use server'

import { revalidatePath } from 'next/cache'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { DEFAULT_ADJUSTMENT_PERCENTAGE } from '@/domain/calculations/calories'
import { calculateAge } from '@/domain/entities/student-profile'
import { PrismaStudentHealthRepository } from '@/infrastructure/database/prisma/repositories/prisma-student-health.repository'
import {
  studentMeasurementSchema,
  type StudentMeasurementFormInput,
} from '@/schemas/student-measurement.schema'
import { recordSnapshot } from './record-snapshot'

export interface LogMeasurementResult {
  error?: string
}

/**
 * Logs a new weight/body-fat/waist entry and immediately recomputes a
 * fresh snapshot from it — measurements are meaningless to show on
 * their own without the BMI/TDEE/macros they drive (doc section 32-34).
 * Uses the student's active goal if they've set one, or a maintenance
 * baseline (0% adjustment) if they haven't — matching the same default
 * the standalone TDEE calculator shows for "manutenção".
 */
export async function logMeasurement(
  input: StudentMeasurementFormInput
): Promise<LogMeasurementResult> {
  const parsed = studentMeasurementSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const profile = await getCurrentProfile()
  assertRole(profile, ['student'])

  const repo = new PrismaStudentHealthRepository()
  const [birthDate, healthProfile, activeGoal] = await Promise.all([
    repo.getBirthDate(profile.id),
    repo.getHealthProfile(profile.id),
    repo.getActiveGoal(profile.id),
  ])

  if (!birthDate || !healthProfile) {
    return { error: 'Complete seu perfil de saúde antes de registrar uma medição.' }
  }

  const measurement = await repo.addMeasurement(profile.id, {
    weightKg: parsed.data.weightKg,
    bodyFatPercentage: parsed.data.bodyFatPercentage,
    waistCm: parsed.data.waistCm,
    recordedBy: profile.id,
  })

  const goal = activeGoal
    ? { type: activeGoal.type, adjustmentPercentage: activeGoal.calorieAdjustmentPercent }
    : { type: 'maintain' as const, adjustmentPercentage: DEFAULT_ADJUSTMENT_PERCENTAGE.maintain }

  await recordSnapshot(repo, {
    studentId: profile.id,
    age: calculateAge(birthDate),
    healthProfile,
    measurement,
    goal,
    goalId: activeGoal?.id,
    createdBy: profile.id,
  })

  revalidatePath('/app/aluno')
  return {}
}
