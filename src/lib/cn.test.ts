import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names with a space', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('filters out falsy values', () => {
    expect(cn('a', false, undefined, null, 0, 'b')).toBe('a b')
  })

  it('returns an empty string when nothing is truthy', () => {
    expect(cn(false, undefined, null)).toBe('')
  })

  it('resolves conflicting Tailwind utilities, keeping the last one', () => {
    expect(cn('h-[50px] px-7', 'h-10')).toBe('px-7 h-10')
    expect(cn('bg-white/40 text-text-primary', 'bg-white')).toBe('text-text-primary bg-white')
  })
})
