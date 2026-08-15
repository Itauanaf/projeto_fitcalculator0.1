import type { Metadata } from 'next'
import { getStudentDashboard } from '@/application/students/get-student-dashboard'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { LogoutButton } from '@/features/auth/logout-button'
import {
  GoalForm,
  HealthProfileForm,
  MeasurementForm,
  MeasurementHistory,
  MetricsSummary,
} from '@/features/dashboard'

export const metadata: Metadata = {
  title: 'Meu painel · FitCalculator',
}

export default async function StudentDashboardPage() {
  const profile = await getCurrentProfile()
  assertRole(profile, ['student'])

  const dashboard = await getStudentDashboard(profile.id)

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

      {!dashboard.onboarded ? (
        <HealthProfileForm isOnboarding />
      ) : (
        <>
          <MetricsSummary snapshot={dashboard.latestSnapshot} />

          <div className="grid gap-6 sm:grid-cols-2">
            <MeasurementForm />
            <GoalForm
              initialValues={
                dashboard.activeGoal
                  ? {
                      type: dashboard.activeGoal.type,
                      targetWeightKg: dashboard.activeGoal.targetWeightKg,
                      calorieAdjustmentPercent: dashboard.activeGoal.calorieAdjustmentPercent,
                    }
                  : undefined
              }
            />
          </div>

          <MeasurementHistory measurements={dashboard.measurements} />

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
