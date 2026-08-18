import { createHash, randomBytes } from 'node:crypto'

export interface GeneratedInviteToken {
  /** The raw token — goes into the invite link (`/convite/<token>`), never stored. */
  token: string
  /** SHA-256 hex digest of `token` — what actually gets persisted in `student_invitations`. */
  tokenHash: string
}

/**
 * An invitation token is a bearer credential — anyone holding it can
 * link themselves to the trainer who created it — so it gets the same
 * treatment as a password: only its hash is ever written to the
 * database (see `StudentInvitation`'s doc comment).
 */
export function generateInviteToken(): GeneratedInviteToken {
  const token = randomBytes(32).toString('base64url')
  return { token, tokenHash: hashInviteToken(token) }
}

export function hashInviteToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
