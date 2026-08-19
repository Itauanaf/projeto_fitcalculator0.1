import { History } from 'lucide-react'
import { Sparkline } from '@/components/charts'
import { Card, SectionHeader } from '@/components/ui'
import type { StudentMeasurementRecord } from '@/infrastructure/repositories/student-health-repository'
import { cn } from '@/lib/cn'

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}kg`
}

interface MeasurementHistoryProps {
  measurements: StudentMeasurementRecord[]
}

/** The most recent measurements, newest first — read-only, append-only history (never edited or deleted). */
export function MeasurementHistory({ measurements }: MeasurementHistoryProps) {
  if (measurements.length === 0) {
    return null
  }

  // `measurements` arrives newest-first; the trend line reads left-to-right, oldest-first.
  const weightTrend = [...measurements].reverse().map((m) => m.weightKg)
  const firstWeight = weightTrend[0]
  const lastWeight = weightTrend[weightTrend.length - 1]
  const delta = lastWeight - firstWeight

  return (
    <Card className="flex flex-col gap-5">
      <SectionHeader icon={History} title="Histórico de medições" />

      {weightTrend.length >= 2 && (
        <div className="flex items-center gap-4 rounded-2xl bg-surface-soft p-4">
          <Sparkline points={weightTrend} width={140} height={40} />
          <div>
            <span className="text-xs text-text-secondary">Desde a primeira medição</span>
            <p
              className={cn(
                'text-lg font-semibold',
                delta < 0 ? 'text-emerald-600' : 'text-text-primary'
              )}
            >
              {delta === 0 ? 'Sem variação' : `${delta > 0 ? '+' : ''}${formatKg(delta)}`}
            </p>
          </div>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-border">
        {measurements.map((measurement) => (
          <li
            key={measurement.id}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-sm"
          >
            <span className="text-text-secondary">{formatDate(measurement.recordedAt)}</span>
            <span className="flex flex-wrap gap-x-4 font-medium text-text-primary">
              <span>{formatKg(measurement.weightKg)}</span>
              {measurement.bodyFatPercentage !== undefined && (
                <span className="text-text-secondary">
                  {measurement.bodyFatPercentage.toFixed(1).replace('.', ',')}% gordura
                </span>
              )}
              {measurement.waistCm !== undefined && (
                <span className="text-text-secondary">
                  {measurement.waistCm.toFixed(1).replace('.', ',')}cm cintura
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
