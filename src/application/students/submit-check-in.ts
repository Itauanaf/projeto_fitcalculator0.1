'use server'

import { revalidatePath } from 'next/cache'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { DEFAULT_ADJUSTMENT_PERCENTAGE } from '@/domain/calculations/calories'
import { calculateAge } from '@/domain/entities/student-profile'
import { PrismaStudentHealthRepository } from '@/infrastructure/database/prisma/repositories/prisma-student-health.repository'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import { emptyToUndefined } from '@/lib/forms'
import {
  studentCheckInSchema,
  type StudentCheckInFormInput,
} from '@/schemas/student-check-in.schema'
import { recordSnapshot } from './record-snapshot'

export interface SubmitCheckInResult {
  error?: string
}

/**
 * The student's periodic check-in: records the weight as a regular
 * measurement, the subjective fields as a `StudentCheckIn`, recomputes
 * a snapshot from the new weight (same as `logMeasurement`), and
 * reschedules `nextCheckInAt` on every trainer link this student has
 * — see doc section 33's flow.
 */
export async function submitCheckIn(input: StudentCheckInFormInput): Promise<SubmitCheckInResult> {
  const parsed = studentCheckInSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const profile = await getCurrentProfile()
  assertRole(profile, ['student'])

  const healthRepo = new PrismaStudentHealthRepository()
  const [birthDate, healthProfile, activeGoal] = await Promise.all([
    healthRepo.getBirthDate(profile.id),
    healthRepo.getHealthProfile(profile.id),
    healthRepo.getActiveGoal(profile.id),
  ])

  if (!birthDate || !healthProfile) {
    return { error: 'Complete seu perfil de saúde antes de fazer um check-in.' }
  }

  const { measurement, checkIn } = await healthRepo.addCheckIn(profile.id, {
    weightKg: parsed.data.weightKg,
    energyLevel: parsed.data.energyLevel,
    hungerLevel: parsed.data.hungerLevel,
    sleepQuality: parsed.data.sleepQuality,
    workoutsCompleted: parsed.data.workoutsCompleted,
    nutritionAdherencePercentage: parsed.data.nutritionAdherencePercentage,
    notes: emptyToUndefined(parsed.data.notes),
    recordedBy: profile.id,
  })

  const goal = activeGoal
    ? { type: activeGoal.type, adjustmentPercentage: activeGoal.calorieAdjustmentPercent }
    : { type: 'maintain' as const, adjustmentPercentage: DEFAULT_ADJUSTMENT_PERCENTAGE.maintain }

  await recordSnapshot(healthRepo, {
    studentId: profile.id,
    age: calculateAge(birthDate),
    healthProfile,
    measurement,
    goal,
    goalId: activeGoal?.id,
    createdBy: profile.id,
  })

  await new PrismaTrainerRepository().recordCheckInCompleted(profile.id, checkIn.submittedAt)

  revalidatePath('/app/aluno')
  return {}
}
