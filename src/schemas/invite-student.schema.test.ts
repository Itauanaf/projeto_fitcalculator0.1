import { describe, expect, it } from 'vitest'
import { inviteStudentSchema } from './invite-student.schema'

describe('inviteStudentSchema', () => {
  it('accepts a valid email', () => {
    expect(inviteStudentSchema.safeParse({ email: 'aluno@example.com' }).success).toBe(true)
  })

  it('rejects a malformed email', () => {
    expect(inviteStudentSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects a missing email', () => {
    expect(inviteStudentSchema.safeParse({}).success).toBe(false)
  })
})
