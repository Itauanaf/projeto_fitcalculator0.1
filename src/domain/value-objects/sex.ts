/**
 * Sex as used by the calculation formulas (Mifflin-St Jeor, etc).
 * This is the value the user selects for the *equation*, not a
 * statement about gender identity.
 */
export const SEX_VALUES = ['male', 'female'] as const

export type Sex = (typeof SEX_VALUES)[number]
