import type { Metadata } from 'next'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { getTrainerDashboard } from '@/application/trainers/get-trainer-dashboard'
import { LogoutButton } from '@/features/auth/logout-button'
import {
  InvitationsList,
  InviteStudentForm,
  StudentsList,
  TrainerProfileForm,
} from '@/features/trainer-dashboard'

export const metadata: Metadata = {
  title: 'Painel do personal · FitCalculator',
}

export default async function TrainerDashboardPage() {
  const profile = await getCurrentProfile()
  assertRole(profile, ['trainer', 'admin'])

  const dashboard = await getTrainerDashboard(profile.id)

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

      <InviteStudentForm />
      <StudentsList students={dashboard.students} />
      <InvitationsList invitations={dashboard.invitations} />

      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-primary">
          Editar seu perfil
        </summary>
        <div className="mt-4">
          <TrainerProfileForm initialValues={dashboard.trainerProfile ?? undefined} />
        </div>
      </details>
    </main>
  )
}
