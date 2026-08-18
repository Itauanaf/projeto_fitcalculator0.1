'use server'

import { revalidatePath } from 'next/cache'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import { emptyToUndefined } from '@/lib/forms'
import {
  trainerProfileSchema,
  type TrainerProfileFormInput,
} from '@/schemas/trainer-profile.schema'

export interface SaveTrainerProfileResult {
  error?: string
}

export async function saveTrainerProfile(
  input: TrainerProfileFormInput
): Promise<SaveTrainerProfileResult> {
  const parsed = trainerProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  const profile = await getCurrentProfile()
  assertRole(profile, ['trainer', 'admin'])

  await new PrismaTrainerRepository().saveTrainerProfile(profile.id, {
    phone: emptyToUndefined(parsed.data.phone),
    cref: emptyToUndefined(parsed.data.cref),
    bio: emptyToUndefined(parsed.data.bio),
  })

  revalidatePath('/app/personal')
  return {}
}
