import { describe, expect, it } from 'vitest'
import { setCheckInFrequencySchema } from './check-in-frequency.schema'

describe('setCheckInFrequencySchema', () => {
  it('accepts each valid frequency', () => {
    for (const frequency of ['weekly', 'biweekly', 'monthly', 'manual']) {
      expect(setCheckInFrequencySchema.safeParse({ frequency }).success).toBe(true)
    }
  })

  it('rejects an unknown frequency', () => {
    expect(setCheckInFrequencySchema.safeParse({ frequency: 'daily' }).success).toBe(false)
  })

  it('rejects a missing frequency', () => {
    expect(setCheckInFrequencySchema.safeParse({}).success).toBe(false)
  })
})
