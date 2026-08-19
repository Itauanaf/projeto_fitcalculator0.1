import { Target } from 'lucide-react'
import { Card, SectionHeader } from '@/components/ui'
import { GOAL_LABELS } from '@/constants/labels'
import { formatDateOnly } from '@/lib/dates'
import type { StudentGoalRecord } from '@/infrastructure/repositories/student-health-repository'

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}kg`
}

interface StudentGoalCardProps {
  goal: StudentGoalRecord | null
}

/** Read-only summary of the student's active goal — the trainer never sets it, only the student does. */
export function StudentGoalCard({ goal }: StudentGoalCardProps) {
  if (!goal) {
    return (
      <Card className="flex flex-col gap-2">
        <SectionHeader icon={Target} title="Objetivo" />
        <p className="text-text-secondary">Este aluno ainda não definiu um objetivo.</p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader icon={Target} title="Objetivo" />
      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-text-secondary">Tipo</dt>
          <dd className="font-medium text-text-primary">{GOAL_LABELS[goal.type]}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-secondary">Ajuste sobre o TDEE</dt>
          <dd className="font-medium text-text-primary">
            {goal.calorieAdjustmentPercent > 0 ? '+' : ''}
            {goal.calorieAdjustmentPercent}%
          </dd>
        </div>
        {goal.targetWeightKg !== undefined && (
          <div>
            <dt className="text-xs text-text-secondary">Peso alvo</dt>
            <dd className="font-medium text-text-primary">{formatKg(goal.targetWeightKg)}</dd>
          </div>
        )}
        {goal.targetDate && (
          <div>
            <dt className="text-xs text-text-secondary">Prazo</dt>
            <dd className="font-medium text-text-primary">{formatDateOnly(goal.targetDate)}</dd>
          </div>
        )}
      </dl>
    </Card>
  )
}
