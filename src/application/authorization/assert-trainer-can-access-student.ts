import { redirect } from 'next/navigation'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'

/**
 * Redirects back to the trainer's own dashboard unless there's an
 * active `TrainerStudent` link between them and this student — the
 * only relationship that grants a trainer access to a student's data
 * (see `TrainerStudent`'s doc comment). A URL containing a student ID
 * is never trusted on its own (doc section 45-46).
 */
export async function assertTrainerCanAccessStudent(
  trainerId: string,
  studentId: string
): Promise<void> {
  const isLinked = await new PrismaTrainerRepository().isActivelyLinked(trainerId, studentId)
  if (!isLinked) {
    redirect('/app/personal')
  }
}
