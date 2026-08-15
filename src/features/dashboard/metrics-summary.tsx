import { ResultCard } from '@/components/ui'
import { BMI_CLASSIFICATION_LABELS } from '@/constants/labels'
import type { StudentSnapshotRecord } from '@/infrastructure/repositories/student-health-repository'

function formatKcal(value: number): string {
  return `${value.toLocaleString('pt-BR')} kcal`
}

interface MetricsSummaryProps {
  snapshot: StudentSnapshotRecord | null
}

/** The latest computed BMI/TDEE/macros — or a nudge to log a first measurement when there isn't one yet. */
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

  return (
    <ResultCard className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <span className="text-sm text-text-secondary">IMC</span>
          <p className="text-3xl font-semibold tracking-tight text-text-primary">
            {snapshot.bmi.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-sm font-medium text-text-secondary">
            {BMI_CLASSIFICATION_LABELS[snapshot.bmiClassification]}
          </p>
        </div>
        <div>
          <span className="text-sm text-text-secondary">TMB</span>
          <p className="text-3xl font-semibold tracking-tight text-text-primary">
            {formatKcal(snapshot.bmrKcal)}
          </p>
        </div>
        <div>
          <span className="text-sm text-text-secondary">TDEE</span>
          <p className="text-3xl font-semibold tracking-tight text-text-primary">
            {formatKcal(snapshot.tdeeKcal)}
          </p>
        </div>
      </div>

      <div>
        <span className="text-sm text-text-secondary">Meta calórica</span>
        <p className="text-3xl font-semibold tracking-tight text-text-primary">
          {formatKcal(snapshot.calorieTargetKcal)}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-3">
          <span className="text-xs text-text-secondary">Proteína</span>
          <p className="text-lg font-medium text-text-primary">{Math.round(snapshot.proteinG)}g</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <span className="text-xs text-text-secondary">Carboidratos</span>
          <p className="text-lg font-medium text-text-primary">{Math.round(snapshot.carbsG)}g</p>
        </div>
        <div className="rounded-lg border border-border p-3">
          <span className="text-xs text-text-secondary">Gorduras</span>
          <p className="text-lg font-medium text-text-primary">{Math.round(snapshot.fatG)}g</p>
        </div>
      </div>
    </ResultCard>
  )
}
