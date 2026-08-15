import { Card } from '@/components/ui'
import type { StudentMeasurementRecord } from '@/infrastructure/repositories/student-health-repository'

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

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-text-primary">Histórico de medições</h2>
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
