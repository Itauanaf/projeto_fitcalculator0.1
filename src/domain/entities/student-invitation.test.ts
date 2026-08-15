import { describe, expect, it } from 'vitest'
import {
  canAcceptInvitation,
  isInvitationExpired,
  type StudentInvitation,
} from './student-invitation'

function invitation(overrides: Partial<StudentInvitation> = {}): StudentInvitation {
  return {
    id: 'invitation-1',
    trainerId: 'trainer-1',
    email: 'aluno@example.com',
    tokenHash: 'hashed-token',
    status: 'pending',
    expiresAt: new Date('2026-01-08T00:00:00.000Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  }
}

describe('isInvitationExpired', () => {
  it('is false before the expiry timestamp', () => {
    expect(isInvitationExpired(invitation(), new Date('2026-01-05'))).toBe(false)
  })

  it('is true after the expiry timestamp', () => {
    expect(isInvitationExpired(invitation(), new Date('2026-01-09'))).toBe(true)
  })

  it('is true exactly at the expiry timestamp', () => {
    const inv = invitation({ expiresAt: new Date('2026-01-08T00:00:00.000Z') })
    expect(isInvitationExpired(inv, new Date('2026-01-08T00:00:00.000Z'))).toBe(true)
  })
})

describe('canAcceptInvitation', () => {
  it('is true while pending and not expired', () => {
    expect(canAcceptInvitation(invitation(), new Date('2026-01-05'))).toBe(true)
  })

  it('is false once expired, even if still marked pending', () => {
    expect(canAcceptInvitation(invitation(), new Date('2026-01-09'))).toBe(false)
  })

  it('is false for a non-pending status regardless of expiry', () => {
    expect(canAcceptInvitation(invitation({ status: 'accepted' }), new Date('2026-01-05'))).toBe(
      false
    )
    expect(canAcceptInvitation(invitation({ status: 'cancelled' }), new Date('2026-01-05'))).toBe(
      false
    )
  })
})
