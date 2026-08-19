import { Flame, HeartPulse, Scale, Target } from 'lucide-react'
import { DonutChart, SemicircleGauge } from '@/components/charts'
import { Badge, Card, ResultCard, StatCard } from '@/components/ui'
import { BMI_CLASSIFICATION_LABELS, BMI_CLASSIFICATION_TONE } from '@/constants/labels'
import { CALORIES_PER_GRAM } from '@/domain/calculations/macros'
import { bmiGaugeFraction } from '@/lib/bmi-gauge'
import type { StudentSnapshotRecord } from '@/infrastructure/repositories/student-health-repository'

function formatKcal(value: number): string {
  return `${value.toLocaleString('pt-BR')} kcal`
}

interface MetricsSummaryProps {
  snapshot: StudentSnapshotRecord | null
}

/** The latest computed BMI/TDEE/macros as a KPI row + two chart cards — or a nudge to log a first measurement. */
export function MetricsSummary({ snapshot }: MetricsSummaryProps) {
  if (!snapshot) {
    return (
      <ResultCard>
        <p className="text-text-secondary">
          Registre sua primeira medição abaixo para ver seu IMC, TDEE e macros.
        </p>
      </ResultCard>
    )
  }

  const macros = [
    {
      label: 'Proteína',
      grams: snapshot.proteinG,
      kcalPerGram: CALORIES_PER_GRAM.protein,
      color: '#554FE8',
    },
    {
      label: 'Carboidratos',
      grams: snapshot.carbsG,
      kcalPerGram: CALORIES_PER_GRAM.carbs,
      color: '#8390F6',
    },
    {
      label: 'Gorduras',
      grams: snapshot.fatG,
      kcalPerGram: CALORIES_PER_GRAM.fat,
      color: '#E7BD5B',
    },
  ]
  const totalMacroKcal = macros.reduce((sum, macro) => sum + macro.grams * macro.kcalPerGram, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Scale}
          label="IMC"
          value={snapshot.bmi.toFixed(2).replace('.', ',')}
          hint={BMI_CLASSIFICATION_LABELS[snapshot.bmiClassification]}
        />
        <StatCard icon={HeartPulse} label="TMB" value={formatKcal(snapshot.bmrKcal)} />
        <StatCard icon={Flame} label="TDEE" value={formatKcal(snapshot.tdeeKcal)} />
        <StatCard
          icon={Target}
          label="Meta calórica"
          value={formatKcal(snapshot.calorieTargetKcal)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col items-center gap-3 text-center">
          <h3 className="self-start text-sm font-semibold text-text-primary">Faixa de IMC</h3>
          <SemicircleGauge fraction={bmiGaugeFraction(snapshot.bmi)} size={140} strokeWidth={14} />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold tracking-tight text-text-primary">
              {snapshot.bmi.toFixed(2).replace('.', ',')}
            </span>
            <Badge tone={BMI_CLASSIFICATION_TONE[snapshot.bmiClassification]}>
              {BMI_CLASSIFICATION_LABELS[snapshot.bmiClassification]}
            </Badge>
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-text-primary">Distribuição de macros</h3>
          <div className="flex items-center gap-5">
            <DonutChart
              segments={macros.map((macro) => ({ value: macro.grams, color: macro.color }))}
              size={96}
              strokeWidth={14}
            />
            <ul className="flex-1 space-y-2">
              {macros.map((macro) => {
                const kcal = macro.grams * macro.kcalPerGram
                const percent = totalMacroKcal > 0 ? Math.round((kcal / totalMacroKcal) * 100) : 0
                return (
                  <li key={macro.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-text-secondary">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: macro.color }}
                      />
                      {macro.label}
                    </span>
                    <span className="font-semibold text-text-primary">
                      {Math.round(macro.grams)}g · {percent}%
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
