'use server'

import { revalidatePath } from 'next/cache'
import { assertRole } from '@/application/authorization/assert-role'
import { assertTrainerCanAccessStudent } from '@/application/authorization/assert-trainer-can-access-student'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import {
  setCheckInFrequencySchema,
  type SetCheckInFrequencyFormInput,
} from '@/schemas/check-in-frequency.schema'

export interface SetCheckInFrequencyResult {
  error?: string
}

export async function setCheckInFrequency(
  studentId: string,
  input: SetCheckInFrequencyFormInput
): Promise<SetCheckInFrequencyResult> {
  const parsed = setCheckInFrequencySchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const profile = await getCurrentProfile()
  assertRole(profile, ['trainer', 'admin'])
  await assertTrainerCanAccessStudent(profile.id, studentId)

  await new PrismaTrainerRepository().setCheckInFrequency(
    profile.id,
    studentId,
    parsed.data.frequency
  )

  revalidatePath(`/app/personal/alunos/${studentId}`)
  return {}
}
