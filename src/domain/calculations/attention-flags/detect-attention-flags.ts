import type { CheckInStatus } from '../check-in-schedule'
import type { GoalProgressResult } from '../goal-progress'
import { roundTo } from '../shared/rounding'
import type { AttentionFlag } from './attention-flags.types'

const DAY_MS = 24 * 60 * 60 * 1000

/** A student with no weight logged in this many days needs a nudge, regardless of their check-in schedule. */
export const NO_UPDATE_THRESHOLD_DAYS = 14
/** A swing at or above this many kg within the window below is worth flagging — either direction. */
export const SIGNIFICANT_WEIGHT_CHANGE_KG = 3
export const WEIGHT_CHANGE_WINDOW_DAYS = 7
/** Goal progress at or above this percent (but not yet 100%) is "quase lá". */
export const NEAR_GOAL_THRESHOLD_PERCENT = 90
/** Adherence below this percent counts as "low" for a single check-in. */
export const LOW_ADHERENCE_THRESHOLD_PERCENT = 60
/** How many of the most recent check-ins must all be low before it's "recorrente", not a one-off week. */
export const LOW_ADHERENCE_CHECK_IN_COUNT = 2

interface DetectAttentionFlagsInput {
  hasHealthProfile: boolean
  checkInStatus: CheckInStatus
  /** Newest first. */
  measurements: readonly { weightKg: number; recordedAt: Date }[]
  /** Omitted when the student has no active goal, or the goal has no target weight to measure progress against. */
  goalProgress?: GoalProgressResult
  /** Newest first — the adherence percentage from the student's most recent check-ins. */
  recentAdherencePercentages: readonly number[]
  asOf?: Date
}

/**
 * Turns raw student data into the list of operational flags "Precisam
 * de atenção" and the student-list status badges read from — never a
 * medical judgment, only "this changed" or "this is late" (doc section
 * 20). A student can carry more than one flag at once.
 */
export function detectAttentionFlags(input: DetectAttentionFlagsInput): AttentionFlag[] {
  const asOf = input.asOf ?? new Date()
  const flags: AttentionFlag[] = []

  if (!input.hasHealthProfile) {
    flags.push({ kind: 'incomplete_profile' })
  }

  if (input.checkInStatus.kind === 'overdue') {
    flags.push({ kind: 'no_check_in', days: input.checkInStatus.daysOverdue })
  }

  const latestMeasurement = input.measurements[0]
  if (latestMeasurement) {
    const daysSinceUpdate = Math.floor(
      (asOf.getTime() - latestMeasurement.recordedAt.getTime()) / DAY_MS
    )
    if (daysSinceUpdate >= NO_UPDATE_THRESHOLD_DAYS) {
      flags.push({ kind: 'no_weight_update', days: daysSinceUpdate })
    }
  }

  const windowCutoff = asOf.getTime() - WEIGHT_CHANGE_WINDOW_DAYS * DAY_MS
  const withinWindow = input.measurements.filter((m) => m.recordedAt.getTime() >= windowCutoff)
  if (withinWindow.length >= 2) {
    const newest = withinWindow[0]
    const oldest = withinWindow[withinWindow.length - 1]
    const change = newest.weightKg - oldest.weightKg
    if (Math.abs(change) >= SIGNIFICANT_WEIGHT_CHANGE_KG) {
      flags.push({
        kind: 'weight_change',
        weightChangeKg: roundTo(change, 1),
        days: WEIGHT_CHANGE_WINDOW_DAYS,
      })
    }
  }

  if (input.goalProgress) {
    if (input.goalProgress.reached) {
      flags.push({ kind: 'goal_reached' })
    } else if (input.goalProgress.percent >= NEAR_GOAL_THRESHOLD_PERCENT) {
      flags.push({ kind: 'near_goal', percent: input.goalProgress.percent })
    }
  }

  if (input.recentAdherencePercentages.length >= LOW_ADHERENCE_CHECK_IN_COUNT) {
    const recent = input.recentAdherencePercentages.slice(0, LOW_ADHERENCE_CHECK_IN_COUNT)
    if (recent.every((percent) => percent < LOW_ADHERENCE_THRESHOLD_PERCENT)) {
      const average = Math.round(recent.reduce((sum, percent) => sum + percent, 0) / recent.length)
      flags.push({ kind: 'low_adherence', percent: average })
    }
  }

  return flags
}
