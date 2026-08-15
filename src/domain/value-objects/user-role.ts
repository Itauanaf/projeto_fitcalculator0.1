/**
 * Who a `Profile` belongs to. Drives which dashboard a user lands on
 * after login and which authorization checks apply — see
 * `application/authorization/`.
 */
export const USER_ROLE_VALUES = ['student', 'trainer', 'admin'] as const

export type UserRole = (typeof USER_ROLE_VALUES)[number]
