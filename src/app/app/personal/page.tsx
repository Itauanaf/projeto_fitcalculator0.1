import type { Metadata } from 'next'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { LogoutButton } from '@/features/auth/logout-button'

export const metadata: Metadata = {
  title: 'Painel do personal · FitCalculator',
}

/**
 * Placeholder — proves the auth + role-redirect flow end to end.
 * The real trainer dashboard (doc section 47-53) is Milestone 5.
 */
export default async function TrainerDashboardPage() {
  const profile = await getCurrentProfile()
  assertRole(profile, ['trainer', 'admin'])

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12 outline-none"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Bom dia, {profile.fullName}</h1>
          <p className="text-text-secondary">Veja como estão seus alunos.</p>
        </div>
        <LogoutButton />
      </div>
    </main>
  )
}
