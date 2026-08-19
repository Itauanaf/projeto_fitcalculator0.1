import { UserRound } from 'lucide-react'
import { Card, SectionHeader } from '@/components/ui'
import { ACTIVITY_LEVEL_LABELS, MACRO_STRATEGY_LABELS, SEX_LABELS } from '@/constants/labels'
import type { StudentHealthProfileRecord } from '@/infrastructure/repositories/student-health-repository'

interface StudentProfileCardProps {
  age?: number
  healthProfile?: StudentHealthProfileRecord
}

/** Read-only summary of the student's health profile — the trainer never edits it, only the student does. */
export function StudentProfileCard({ age, healthProfile }: StudentProfileCardProps) {
  if (!healthProfile) {
    return (
      <Card className="flex flex-col gap-2">
        <SectionHeader icon={UserRound} title="Perfil de saúde" />
        <p className="text-text-secondary">Este aluno ainda não completou o perfil de saúde.</p>
      </Card>
    )
  }

  const facts = [
    age !== undefined && { label: 'Idade', value: `${age} anos` },
    { label: 'Altura', value: `${healthProfile.heightCm}cm` },
    { label: 'Sexo', value: SEX_LABELS[healthProfile.sex] },
    { label: 'Atividade', value: ACTIVITY_LEVEL_LABELS[healthProfile.activityLevel] },
    { label: 'Macros', value: MACRO_STRATEGY_LABELS[healthProfile.macroStrategy] },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact))

  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader icon={UserRound} title="Perfil de saúde" />
      <dl className="grid gap-4 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs text-text-secondary">{fact.label}</dt>
            <dd className="font-medium text-text-primary">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
