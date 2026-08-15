import type { Metadata } from 'next'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { LogoutButton } from '@/features/auth/logout-button'

export const metadata: Metadata = {
  title: 'Meu painel · FitCalculator',
}

/**
 * Placeholder — proves the auth + role-redirect flow end to end.
 * The real student dashboard (doc section 61-64) is Milestone 4.
 */
export default async function StudentDashboardPage() {
  const profile = await getCurrentProfile()
  assertRole(profile, ['student'])

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12 outline-none"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Olá, {profile.fullName}!</h1>
          <p className="text-text-secondary">Seu progresso, seus resultados.</p>
        </div>
        <LogoutButton />
      </div>
    </main>
  )
}
