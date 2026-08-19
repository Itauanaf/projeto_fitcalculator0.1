import { History } from 'lucide-react'
import { Card, SectionHeader } from '@/components/ui'
import { GOAL_LABELS } from '@/constants/labels'
import type { TimelineEntry } from '@/lib/timeline'

const MONTH_ABBREVIATIONS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

function formatEntryDate(date: Date): string {
  return `${date.getUTCDate()} ${MONTH_ABBREVIATIONS[date.getUTCMonth()]}`
}

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}kg`
}

function describeEntry(entry: TimelineEntry): string {
  if (entry.kind === 'goal_started') {
    const label = GOAL_LABELS[entry.goalType!]
    if (!entry.previousGoalType) {
      return `Objetivo definido — ${label}`
    }
    // Same type as before (e.g. only the target weight/date changed) —
    // "X → X" would read as a no-op change, so name it differently.
    return entry.previousGoalType === entry.goalType
      ? `Objetivo atualizado — ${label}`
      : `Objetivo alterado — ${GOAL_LABELS[entry.previousGoalType]} → ${label}`
  }

  if (entry.kind === 'check_in') {
    const details = [
      `Peso: ${formatKg(entry.weightKg!)}`,
      `Energia ${entry.energyLevel}/5`,
      `Sono ${entry.sleepQuality}/5`,
      `Aderência ${entry.nutritionAdherencePercentage}%`,
    ]
    return `Novo check-in — ${details.join(' · ')}`
  }

  const details = [
    `Peso: ${formatKg(entry.weightKg!)}`,
    entry.bodyFatPercentage !== undefined &&
      `${entry.bodyFatPercentage.toFixed(1).replace('.', ',')}% gordura`,
    entry.waistCm !== undefined && `${entry.waistCm.toFixed(1).replace('.', ',')}cm cintura`,
  ].filter(Boolean)

  return `Nova medição — ${details.join(' · ')}`
}

interface EvolutionTimelineProps {
  entries: TimelineEntry[]
}

/** Chronological feed of measurements and goal changes — "sua jornada" in one scannable list. */
export function EvolutionTimeline({ entries }: EvolutionTimelineProps) {
  if (entries.length === 0) {
    return null
  }

  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader icon={History} title="Timeline de evolução" />
      <ol className="flex flex-col divide-y divide-border">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-baseline gap-4 py-3 text-sm">
            <span className="w-16 shrink-0 font-semibold text-text-primary">
              {formatEntryDate(entry.date)}
            </span>
            <span className="text-text-secondary">{describeEntry(entry)}</span>
          </li>
        ))}
      </ol>
    </Card>
  )
}
