import { describe, expect, it } from 'vitest'
import { trainerProfileSchema } from './trainer-profile.schema'

describe('trainerProfileSchema', () => {
  it('accepts an empty profile — every field is optional', () => {
    expect(trainerProfileSchema.safeParse({}).success).toBe(true)
  })

  it('accepts a fully filled profile', () => {
    const result = trainerProfileSchema.safeParse({
      phone: '11999998888',
      cref: '123456-G/SP',
      bio: 'Personal trainer especializado em hipertrofia.',
    })
    expect(result.success).toBe(true)
  })

  it('accepts an empty string for any field', () => {
    // Normalizing '' to undefined happens where the profile is persisted
    // (`saveTrainerProfile`), not here — see the schema's doc comment.
    const result = trainerProfileSchema.safeParse({ phone: '', cref: '', bio: '' })
    expect(result.success).toBe(true)
  })

  it('rejects a bio over the length limit', () => {
    const result = trainerProfileSchema.safeParse({ bio: 'a'.repeat(501) })
    expect(result.success).toBe(false)
  })
})
