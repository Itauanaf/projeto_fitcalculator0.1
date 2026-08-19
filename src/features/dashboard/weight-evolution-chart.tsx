'use client'

import { LineChart as LineChartIcon } from 'lucide-react'
import { useState } from 'react'
import { LineChart } from '@/components/charts'
import { Card, SectionHeader } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { StudentMeasurementRecord } from '@/infrastructure/repositories/student-health-repository'

const PERIODS = [
  { key: '30d', label: '30 dias', days: 30 },
  { key: '3m', label: '3 meses', days: 90 },
  { key: '6m', label: '6 meses', days: 180 },
  { key: '1y', label: '1 ano', days: 365 },
  { key: 'all', label: 'Tudo', days: null },
] as const

type PeriodKey = (typeof PERIODS)[number]['key']

function formatKg(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}kg`
}

interface WeightEvolutionChartProps {
  /** Newest first — the same shape `listMeasurements` returns. */
  measurements: StudentMeasurementRecord[]
}

/** Weight evolution over a selectable period — 30 days through "tudo". */
export function WeightEvolutionChart({ measurements }: WeightEvolutionChartProps) {
  const [period, setPeriod] = useState<PeriodKey>('3m')
  // Lazy initializer — reads the impure `Date.now()` once, at mount,
  // rather than on every render (which the React Compiler's purity
  // check would otherwise flag).
  const [nowMs] = useState(() => Date.now())

  if (measurements.length < 2) {
    return (
      <Card className="flex flex-col gap-2">
        <SectionHeader icon={LineChartIcon} title="Evolução do peso" />
        <p className="text-text-secondary">
          Registre pelo menos duas medições para ver sua evolução.
        </p>
      </Card>
    )
  }

  const selected = PERIODS.find((p) => p.key === period)!
  const cutoff = selected.days ? nowMs - selected.days * 24 * 60 * 60 * 1000 : null

  // `measurements` arrives newest-first; the chart reads left-to-right, oldest-first.
  const chronological = [...measurements].reverse()
  const filtered =
    cutoff === null ? chronological : chronological.filter((m) => m.recordedAt.getTime() >= cutoff)

  const weights = filtered.map((m) => m.weightKg)
  const hasEnoughData = weights.length >= 2

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeader icon={LineChartIcon} title="Evolução do peso" />
        <div
          role="tablist"
          aria-label="Período"
          className="inline-flex gap-1 rounded-full bg-surface-soft p-1"
        >
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              aria-selected={period === p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                period === p.key
                  ? 'bg-gradient-to-r from-[#625CF3] to-primary-hover text-white shadow-[0_6px_16px_rgba(81,71,232,0.25)]'
                  : 'text-text-secondary hover:text-primary'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {hasEnoughData ? (
        <>
          <LineChart points={weights} height={160} />
          <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs text-text-secondary">Peso inicial</span>
              <p className="text-lg font-bold text-text-primary">{formatKg(weights[0])}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary">Peso atual</span>
              <p className="text-lg font-bold text-text-primary">
                {formatKg(weights[weights.length - 1])}
              </p>
            </div>
            <div>
              <span className="text-xs text-text-secondary">Diferença</span>
              <p
                className={cn(
                  'text-lg font-bold',
                  weights[weights.length - 1] - weights[0] < 0
                    ? 'text-emerald-600'
                    : 'text-text-primary'
                )}
              >
                {weights[weights.length - 1] - weights[0] > 0 ? '+' : ''}
                {formatKg(weights[weights.length - 1] - weights[0])}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-text-secondary">Sem medições suficientes neste período.</p>
      )}
    </Card>
  )
}
