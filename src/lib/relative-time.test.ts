import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from './relative-time'

const NOW = new Date('2026-08-19T12:00:00.000Z')
const minutesAgo = (n: number) => new Date(NOW.getTime() - n * 60 * 1000)
const hoursAgo = (n: number) => new Date(NOW.getTime() - n * 60 * 60 * 1000)
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000)

describe('formatRelativeTime', () => {
  it('says "agora mesmo" for anything under a minute', () => {
    expect(formatRelativeTime(minutesAgo(0), NOW)).toBe('agora mesmo')
  })

  it('formats minutes, singular and plural', () => {
    expect(formatRelativeTime(minutesAgo(1), NOW)).toBe('há 1 minuto')
    expect(formatRelativeTime(minutesAgo(20), NOW)).toBe('há 20 minutos')
  })

  it('formats hours, singular and plural', () => {
    expect(formatRelativeTime(hoursAgo(1), NOW)).toBe('há 1 hora')
    expect(formatRelativeTime(hoursAgo(3), NOW)).toBe('há 3 horas')
  })

  it('formats days, singular and plural', () => {
    expect(formatRelativeTime(daysAgo(1), NOW)).toBe('há 1 dia')
    expect(formatRelativeTime(daysAgo(2), NOW)).toBe('há 2 dias')
  })

  it('falls back to a plain date once a week or older', () => {
    expect(formatRelativeTime(daysAgo(9), NOW)).toBe('10/08/2026')
  })
})
