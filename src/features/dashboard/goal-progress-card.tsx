import { TrendingUp } from 'lucide-react'
import { Card, SectionHeader } from '@/components/ui'
import { GOAL_LABELS } from '@/constants/labels'
import { calculateGoalProgress } from '@/domain/calculations/goal-progress'
import { cn } from '@/lib/cn'
import type { StudentGoalRecord } from '@/infrastructure/repositories/student-health-repository'

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}kg`
}

interface GoalProgressCardProps {
  goal: StudentGoalRecord | null
  /** The student's latest logged weight — `undefined` if they haven't measured anything yet. */
  currentWeightKg?: number
}

/**
 * "Peso inicial / atual / meta + % concluído" — only renders the full
 * picture when the goal has a target weight and there's at least one
 * measurement since the goal started. A goal without a target (e.g.
 * plain "manter peso") has nothing to show progress toward, so this
 * quietly shows nothing rather than a fabricated 0%.
 */
export function GoalProgressCard({ goal, currentWeightKg }: GoalProgressCardProps) {
  if (!goal || goal.targetWeightKg === undefined || goal.initialWeightKg === undefined) {
    return null
  }
  if (currentWeightKg === undefined) {
    return null
  }

  const progress = calculateGoalProgress({
    initialWeightKg: goal.initialWeightKg,
    currentWeightKg,
    targetWeightKg: goal.targetWeightKg,
  })

  return (
    <Card className="flex flex-col gap-5">
      <SectionHeader icon={TrendingUp} title={`Meta: ${GOAL_LABELS[goal.type]}`} />

      <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
        <div>
          <span className="text-xs text-text-secondary">Peso inicial</span>
          <p className="text-xl font-bold text-text-primary">{formatKg(goal.initialWeightKg)}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary">Peso atual</span>
          <p className="text-xl font-bold text-text-primary">{formatKg(currentWeightKg)}</p>
        </div>
        <div>
          <span className="text-xs text-text-secondary">Meta</span>
          <p className="text-xl font-bold text-text-primary">{formatKg(goal.targetWeightKg)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-soft">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              progress.reached
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-[#625CF3] to-primary-hover'
            )}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-text-primary">{progress.percent}% concluído</span>
          {progress.reached ? (
            <span className="font-medium text-emerald-600">Meta atingida</span>
          ) : (
            <span className="text-text-secondary">{formatKg(progress.remainingKg)} restantes</span>
          )}
        </div>
      </div>

      <p className="text-sm text-text-secondary">
        {progress.deltaFromStartKg === 0
          ? 'Sem variação desde o início.'
          : `${progress.deltaFromStartKg > 0 ? '+' : ''}${formatKg(progress.deltaFromStartKg)} desde o início.`}
      </p>
    </Card>
  )
}
