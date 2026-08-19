/**
 * Every reason a student might surface in "Precisam de atenção" —
 * deliberately operational, not medical (doc section 20: never phrase
 * these as health judgments, only as "this changed" / "this is late").
 */
export type AttentionFlagKind =
  | 'no_check_in'
  | 'no_weight_update'
  | 'weight_change'
  | 'incomplete_profile'
  | 'goal_reached'
  | 'near_goal'
  | 'low_adherence'

export interface AttentionFlag {
  kind: AttentionFlagKind
  /** Days late/since, for `no_check_in` and `no_weight_update`. */
  days?: number
  /** Signed — for `weight_change`. */
  weightChangeKg?: number
  /** For `near_goal` (progress %) and `low_adherence` (average adherence %). */
  percent?: number
}

/** A simple, non-medical status derived from a student's flags — what a trainer scans a student list for. */
export type StudentStatus = 'active' | 'no_updates' | 'goal_reached'
