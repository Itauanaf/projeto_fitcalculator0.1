import type { RelationshipStatus } from '../value-objects/relationship-status'

/**
 * A link between a trainer and a student. Deliberately its own table
 * (not a `trainerId` column on the student) so a student can be linked
 * to more than one trainer later without changing the model, and so a
 * trainer never gains access to a student without an explicit `active`
 * row here — see `assertTrainerCanAccessStudent`.
 */
export interface TrainerStudent {
  id: string
  trainerId: string
  studentId: string
  status: RelationshipStatus
  startedAt?: Date
  endedAt?: Date
  createdAt: Date
  updatedAt: Date
}
