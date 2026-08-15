import { describe, expect, it } from 'vitest'
import { mifflinStJeorFemale, mifflinStJeorMale } from './mifflin-st-jeor'

describe('mifflinStJeorMale', () => {
  it('computes 10w + 6.25h - 5a + 5', () => {
    expect(mifflinStJeorMale({ weightKg: 70, heightCm: 175, age: 30 })).toBeCloseTo(1648.75)
  })
})

describe('mifflinStJeorFemale', () => {
  it('computes 10w + 6.25h - 5a - 161', () => {
    expect(mifflinStJeorFemale({ weightKg: 70, heightCm: 175, age: 30 })).toBeCloseTo(1482.75)
  })
})
