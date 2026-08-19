import { Activity } from 'lucide-react'
import { Card, SectionHeader } from '@/components/ui'
import { GOAL_LABELS } from '@/constants/labels'
import type { ActivityEntry } from '@/lib/trainer-activity-feed'
import { formatRelativeTime } from '@/lib/relative-time'

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}kg`
}

function describeEntry(entry: ActivityEntry): string {
  switch (entry.kind) {
    case 'measurement':
      return `${entry.studentName} registrou novo peso`
    case 'check_in':
      return `${entry.studentName} realizou check-in`
    case 'goal_changed':
      return `Objetivo de ${entry.studentName} alterado para ${GOAL_LABELS[entry.goalType!]}`
  }
}

interface RecentActivityFeedProps {
  entries: ActivityEntry[]
}

/** A trainer-wide feed of what their students have been doing, newest first — derived from existing data, see `buildTrainerActivityFeed`. */
export function RecentActivityFeed({ entries }: RecentActivityFeedProps) {
  if (entries.length === 0) {
    return null
  }

  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader icon={Activity} title="Atividade recente" />
      <ul className="flex flex-col divide-y divide-border">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-4 py-3 text-sm">
            <div>
              <p className="font-medium text-text-primary">{describeEntry(entry)}</p>
              {entry.weightKg !== undefined && (
                <p className="text-text-secondary">{formatKg(entry.weightKg)}</p>
              )}
            </div>
            <span className="shrink-0 text-text-secondary">{formatRelativeTime(entry.date)}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
