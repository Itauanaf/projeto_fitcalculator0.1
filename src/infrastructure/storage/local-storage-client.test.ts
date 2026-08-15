import { beforeEach, describe, expect, it } from 'vitest'
import { readJson, removeItem, writeJson } from './local-storage-client'

const KEY = 'fitcalculator.test-key'

beforeEach(() => {
  window.localStorage.clear()
})

describe('writeJson / readJson', () => {
  it('round-trips a value through localStorage', () => {
    writeJson(KEY, { a: 1, b: [1, 2, 3] })
    expect(readJson(KEY)).toEqual({ a: 1, b: [1, 2, 3] })
  })

  it('returns null when the key is absent', () => {
    expect(readJson('fitcalculator.missing-key')).toBeNull()
  })

  it('returns null instead of throwing for a corrupted value', () => {
    window.localStorage.setItem(KEY, '{not valid json')
    expect(readJson(KEY)).toBeNull()
  })
})

describe('removeItem', () => {
  it('deletes a stored value', () => {
    writeJson(KEY, { a: 1 })
    removeItem(KEY)
    expect(readJson(KEY)).toBeNull()
  })
})
