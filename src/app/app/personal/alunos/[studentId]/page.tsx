import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { assertRole } from '@/application/authorization/assert-role'
import { assertTrainerCanAccessStudent } from '@/application/authorization/assert-trainer-can-access-student'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { getStudentDetail } from '@/application/trainers/get-student-detail'
import { Avatar } from '@/components/ui'
import {
  EvolutionTimeline,
  GoalProgressCard,
  MeasurementHistory,
  MetricsSummary,
  WeightEvolutionChart,
} from '@/features/dashboard'
import {
  CheckInFrequencyForm,
  StudentGoalCard,
  StudentProfileCard,
} from '@/features/trainer-dashboard'
import { buildStudentTimeline } from '@/lib/timeline'

export const metadata: Metadata = {
  title: 'Detalhes do aluno · FitCalculator',
}

export default async function StudentDetailPage({
  params,
}: PageProps<'/app/personal/alunos/[studentId]'>) {
  const { studentId } = await params

  const profile = await getCurrentProfile()
  assertRole(profile, ['trainer', 'admin'])
  await assertTrainerCanAccessStudent(profile.id, studentId)

  const detail = await getStudentDetail(studentId)
  // `measurements` arrives newest-first — the first entry is the latest weight.
  const currentWeightKg = detail.measurements[0]?.weightKg

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12 outline-none"
    >
      <div className="flex flex-col gap-4">
        <Link
          href="/app/personal"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar
        </Link>

        <div className="flex items-center gap-4">
          <Avatar name={detail.fullName} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{detail.fullName}</h1>
            {detail.age !== undefined && <p className="text-text-secondary">{detail.age} anos</p>}
          </div>
        </div>
      </div>

      <MetricsSummary snapshot={detail.latestSnapshot} />

      <GoalProgressCard goal={detail.activeGoal} currentWeightKg={currentWeightKg} />

      <WeightEvolutionChart measurements={detail.measurements} />

      <div className="grid gap-6 lg:grid-cols-2">
        <StudentProfileCard age={detail.age} healthProfile={detail.healthProfile} />
        <StudentGoalCard goal={detail.activeGoal} />
      </div>

      <CheckInFrequencyForm studentId={studentId} schedule={detail.checkInSchedule} />

      <MeasurementHistory measurements={detail.measurements} />

      <EvolutionTimeline
        entries={buildStudentTimeline(detail.measurements, detail.goals, detail.checkIns)}
      />
    </main>
  )
}
