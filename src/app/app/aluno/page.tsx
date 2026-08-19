import type { Metadata } from 'next'
import { getStudentDashboard } from '@/application/students/get-student-dashboard'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { Avatar } from '@/components/ui'
import { LogoutButton } from '@/features/auth/logout-button'
import {
  EvolutionTimeline,
  GoalForm,
  GoalProgressCard,
  HealthProfileForm,
  MeasurementForm,
  MeasurementHistory,
  MetricsSummary,
  WeightEvolutionChart,
} from '@/features/dashboard'
import { buildStudentTimeline } from '@/lib/timeline'

export const metadata: Metadata = {
  title: 'Meu painel · FitCalculator',
}

export default async function StudentDashboardPage() {
  const profile = await getCurrentProfile()
  assertRole(profile, ['student'])

  const dashboard = await getStudentDashboard(profile.id)
  // `measurements` arrives newest-first — the first entry is the latest weight.
  const currentWeightKg = dashboard.measurements[0]?.weightKg

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
            <h1 className="text-2xl font-semibold text-text-primary">Olá, {profile.fullName}!</h1>
            <p className="text-text-secondary">Seu progresso, seus resultados.</p>
          </div>
        </div>
        <LogoutButton />
      </div>

      {!dashboard.onboarded ? (
        <HealthProfileForm isOnboarding />
      ) : (
        <>
          <MetricsSummary snapshot={dashboard.latestSnapshot} />

          <GoalProgressCard goal={dashboard.activeGoal} currentWeightKg={currentWeightKg} />

          <WeightEvolutionChart measurements={dashboard.measurements} />

          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold tracking-wide text-text-muted uppercase">Ações</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <MeasurementForm />
              <GoalForm
                initialValues={
                  dashboard.activeGoal
                    ? {
                        type: dashboard.activeGoal.type,
                        targetWeightKg: dashboard.activeGoal.targetWeightKg,
                        targetDate: dashboard.activeGoal.targetDate,
                        calorieAdjustmentPercent: dashboard.activeGoal.calorieAdjustmentPercent,
                      }
                    : undefined
                }
              />
            </div>
          </div>

          <MeasurementHistory measurements={dashboard.measurements} />

          <EvolutionTimeline
            entries={buildStudentTimeline(dashboard.measurements, dashboard.goals)}
          />

          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-primary">
              Editar perfil de saúde
            </summary>
            <div className="mt-4">
              <HealthProfileForm
                initialValues={
                  dashboard.birthDate && dashboard.healthProfile
                    ? { birthDate: dashboard.birthDate, ...dashboard.healthProfile }
                    : undefined
                }
              />
            </div>
          </details>
        </>
      )}
    </main>
  )
}
