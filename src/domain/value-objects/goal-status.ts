/**
 * Lifecycle of a `Goal`. Only one goal should be `active` per student at
 * a time — enforced by the application layer when a new goal is created
 * (the previous active one is moved to `completed`/`cancelled` first),
 * not by this type.
 */
export const GOAL_STATUS_VALUES = ['active', 'completed', 'cancelled'] as const

export type GoalStatus = (typeof GOAL_STATUS_VALUES)[number]
