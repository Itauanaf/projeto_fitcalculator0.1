import { CheckCircle2, ClipboardCheck, Clock, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { getTrainerDashboard } from '@/application/trainers/get-trainer-dashboard'
import { Avatar, StatCard } from '@/components/ui'
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
  const pendingInvitations = dashboard.invitations.filter((i) => i.status === 'pending').length
  const acceptedInvitations = dashboard.invitations.filter((i) => i.status === 'accepted').length

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12 outline-none"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={profile.fullName} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Bom dia, {profile.fullName}
            </h1>
            <p className="text-text-secondary">Veja como estão seus alunos.</p>
          </div>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Alunos ativos" value={String(dashboard.students.length)} />
        <StatCard
          icon={ClipboardCheck}
          label="Novos check-ins"
          value={String(dashboard.newCheckInsCount)}
          hint="Últimos 7 dias"
        />
        <StatCard icon={Clock} label="Convites pendentes" value={String(pendingInvitations)} />
        <StatCard
          icon={CheckCircle2}
          label="Convites aceitos"
          value={String(acceptedInvitations)}
        />
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
