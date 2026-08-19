'use server'

import { revalidatePath } from 'next/cache'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { calculateAge } from '@/domain/entities/student-profile'
import { PrismaStudentHealthRepository } from '@/infrastructure/database/prisma/repositories/prisma-student-health.repository'
import { emptyToUndefined } from '@/lib/forms'
import { studentGoalSchema, type StudentGoalFormInput } from '@/schemas/student-goal.schema'
import { recordSnapshot } from './record-snapshot'

export interface SetGoalResult {
  error?: string
}

/**
 * Ends the student's current goal (if any) and starts a new one. If a
 * health profile and at least one measurement already exist, also
 * recomputes a snapshot right away — otherwise the new goal wouldn't
 * change the numbers shown until the next measurement is logged.
 */
export async function setGoal(input: StudentGoalFormInput): Promise<SetGoalResult> {
  const parsed = studentGoalSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const profile = await getCurrentProfile()
  assertRole(profile, ['student'])

  const repo = new PrismaStudentHealthRepository()

  const targetDate = emptyToUndefined(parsed.data.targetDate)

  const goal = await repo.setGoal(profile.id, {
    type: parsed.data.type,
    targetWeightKg: parsed.data.targetWeightKg,
    // Bare `YYYY-MM-DD` parses as UTC midnight — see the same note on `birthDate`.
    targetDate: targetDate ? new Date(targetDate) : undefined,
    calorieAdjustmentPercent: parsed.data.calorieAdjustmentPercent,
    createdBy: profile.id,
  })

  const [birthDate, healthProfile, [latestMeasurement]] = await Promise.all([
    repo.getBirthDate(profile.id),
    repo.getHealthProfile(profile.id),
    repo.listMeasurements(profile.id, 1),
  ])

  if (birthDate && healthProfile && latestMeasurement) {
    await recordSnapshot(repo, {
      studentId: profile.id,
      age: calculateAge(birthDate),
      healthProfile,
      measurement: latestMeasurement,
      goal: { type: goal.type, adjustmentPercentage: goal.calorieAdjustmentPercent },
      goalId: goal.id,
      createdBy: profile.id,
    })
  }

  revalidatePath('/app/aluno')
  return {}
}
