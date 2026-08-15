/**
 * One record of "who changed what". Written whenever a trainer mutates a
 * student's data (and, for a full trail, when a student edits their own)
 * — see doc section 39-40. `entityType`/`entityId` point at the row that
 * changed (e.g. `'goal'` / a `StudentGoal.id`); `beforeData`/`afterData`
 * hold just enough of that row to explain the change in a UI like
 * "João Personal alterou objetivo de Ana: MAINTAIN → LOSE_WEIGHT".
 */
export interface AuditLog {
  id: string
  actorUserId: string
  studentId?: string
  action: string
  entityType: string
  entityId: string
  beforeData?: Record<string, unknown>
  afterData?: Record<string, unknown>
  createdAt: Date
}
