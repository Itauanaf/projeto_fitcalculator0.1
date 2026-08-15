import type { UserRole } from '@/domain/value-objects/user-role'

/**
 * Where to send someone right after they authenticate. `admin` has no
 * dedicated dashboard yet (doc section 89 — prepared for, not built in
 * this MVP), so it falls back to the trainer one rather than a page
 * that doesn't exist.
 */
export function getDashboardPathForRole(role: UserRole | undefined): string {
  if (role === 'student') return '/app/aluno'
  if (role === 'trainer' || role === 'admin') return '/app/personal'
  return '/'
}
