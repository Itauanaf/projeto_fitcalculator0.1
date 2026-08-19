import type { AttentionFlag, StudentStatus } from './attention-flags.types'

/**
 * Reduces a student's flags to the single status shown on their list
 * card. `goal_reached` wins over everything else (it's the headline
 * news); missing updates is the next most actionable; otherwise `active`.
 */
export function calculateStudentStatus(flags: readonly AttentionFlag[]): StudentStatus {
  if (flags.some((flag) => flag.kind === 'goal_reached')) return 'goal_reached'
  if (flags.some((flag) => flag.kind === 'no_weight_update' || flag.kind === 'no_check_in')) {
    return 'no_updates'
  }
  return 'active'
}
