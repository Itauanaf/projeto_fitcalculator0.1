/**
 * Status of a `TrainerStudent` link. Only `active` grants a trainer
 * access to a student's data — see `assertTrainerCanAccessStudent`.
 */
export const RELATIONSHIP_STATUS_VALUES = ['pending', 'active', 'inactive'] as const

export type RelationshipStatus = (typeof RELATIONSHIP_STATUS_VALUES)[number]
