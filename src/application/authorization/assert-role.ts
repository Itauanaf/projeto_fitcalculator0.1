import { redirect } from 'next/navigation'
import type { Profile } from '@/domain/entities/profile'
import type { UserRole } from '@/domain/value-objects/user-role'
import { getDashboardPathForRole } from '../auth/get-dashboard-path-for-role'

/**
 * Redirects to the visitor's own dashboard if their role isn't one of
 * `allowed` — e.g. a student who navigates to `/app/personal` bounces
 * back to `/app/aluno` instead of seeing a trainer's UI.
 */
export function assertRole(profile: Profile, allowed: readonly UserRole[]): void {
  if (!allowed.includes(profile.role)) {
    redirect(getDashboardPathForRole(profile.role))
  }
}
