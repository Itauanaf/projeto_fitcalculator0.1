import {
  calculateStudentStatus,
  detectAttentionFlags,
  type AttentionFlag,
  type StudentStatus,
} from '@/domain/calculations/attention-flags'
import { getCheckInStatus } from '@/domain/calculations/check-in-schedule'
import { calculateGoalProgress } from '@/domain/calculations/goal-progress'
import { PrismaTrainerRepository } from '@/infrastructure/database/prisma/repositories/prisma-trainer.repository'
import type { StudentSnapshotRecord } from '@/infrastructure/repositories/student-health-repository'
import type {
  LinkedStudentRecord,
  StudentInvitationRecord,
  TrainerProfileRecord,
} from '@/infrastructure/repositories/trainer-repository'
import { type ActivityEntry, buildTrainerActivityFeed } from '@/lib/trainer-activity-feed'

/** A check-in counts as "new" on the dashboard if it landed within this many days — there's no read/unread tracking, so this is the simplest honest definition. */
const NEW_CHECK_IN_WINDOW_DAYS = 7
const ACTIVITY_FEED_LIMIT = 10

export interface StudentSummary {
  studentId: string
  fullName: string
  latestSnapshot: StudentSnapshotRecord | null
  status: StudentStatus
  flags: AttentionFlag[]
}

export interface AttentionItem {
  studentId: string
  fullName: string
  flag: AttentionFlag
}

export interface TrainerDashboardData {
  trainerProfile: TrainerProfileRecord | null
  invitations: StudentInvitationRecord[]
  students: StudentSummary[]
  newCheckInsCount: number
  needsAttentionCount: number
  goalsReachedCount: number
  attentionItems: AttentionItem[]
  activityFeed: ActivityEntry[]
}

function summarizeStudent(student: LinkedStudentRecord): StudentSummary {
  const currentWeightKg = student.recentMeasurements[0]?.weightKg
  const goalProgress =
    student.activeGoal?.initialWeightKg !== undefined &&
    student.activeGoal?.targetWeightKg !== undefined &&
    currentWeightKg !== undefined
      ? calculateGoalProgress({
          initialWeightKg: student.activeGoal.initialWeightKg,
          currentWeightKg,
          targetWeightKg: student.activeGoal.targetWeightKg,
        })
      : undefined

  const flags = detectAttentionFlags({
    hasHealthProfile: student.hasHealthProfile,
    checkInStatus: getCheckInStatus(student.nextCheckInAt),
    measurements: student.recentMeasurements,
    goalProgress,
    recentAdherencePercentages: student.recentCheckIns.map((c) => c.nutritionAdherencePercentage),
  })

  return {
    studentId: student.studentId,
    fullName: student.fullName,
    latestSnapshot: student.latestSnapshot,
    status: calculateStudentStatus(flags),
    flags,
  }
}

/**
 * Everything the trainer dashboard needs to render. Ensures the
 * `trainer_profiles` row exists first — invitations and student links
 * both FK into it, and nothing else creates it (signup only ever
 * creates the shared `profiles` row).
 */
export async function getTrainerDashboard(trainerId: string): Promise<TrainerDashboardData> {
  const repo = new PrismaTrainerRepository()
  await repo.ensureTrainerProfile(trainerId)

  const [trainerProfile, invitations, linkedStudents] = await Promise.all([
    repo.getTrainerProfile(trainerId),
    repo.listInvitations(trainerId),
    repo.listActiveStudents(trainerId),
  ])

  const windowStart = Date.now() - NEW_CHECK_IN_WINDOW_DAYS * 24 * 60 * 60 * 1000
  const newCheckInsCount = linkedStudents.filter(
    (student) => student.lastCheckInAt && student.lastCheckInAt.getTime() >= windowStart
  ).length

  const students = linkedStudents.map(summarizeStudent)

  const attentionItems: AttentionItem[] = students.flatMap((student) =>
    student.flags.map((flag) => ({
      studentId: student.studentId,
      fullName: student.fullName,
      flag,
    }))
  )

  const activityFeed = buildTrainerActivityFeed(
    linkedStudents.map((student) => ({
      studentId: student.studentId,
      fullName: student.fullName,
      measurements: student.recentMeasurements,
      checkIns: student.recentCheckIns,
      goals: student.recentGoals,
    })),
    ACTIVITY_FEED_LIMIT
  )

  return {
    trainerProfile,
    invitations,
    students,
    newCheckInsCount,
    needsAttentionCount: new Set(attentionItems.map((item) => item.studentId)).size,
    goalsReachedCount: students.filter((student) => student.status === 'goal_reached').length,
    attentionItems,
    activityFeed,
  }
}
