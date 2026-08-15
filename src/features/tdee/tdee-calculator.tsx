'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, NumberField, SelectField } from '@/components/ui'
import { ACTIVITY_LEVEL_LABELS, SEX_LABELS } from '@/constants/labels'
import {
  calculateCalorieTarget,
  DEFAULT_ADJUSTMENT_PERCENTAGE,
} from '@/domain/calculations/calories'
import { calculateTdee, type TdeeResult } from '@/domain/calculations/tdee'
import { ACTIVITY_LEVEL_VALUES } from '@/domain/value-objects/activity-level'
import type { Goal } from '@/domain/value-objects/goal'
import { SEX_VALUES } from '@/domain/value-objects/sex'
import { tdeeFormSchema, type TdeeFormInput } from '@/schemas/tdee.schema'

const SEX_OPTIONS = SEX_VALUES.map((value) => ({ value, label: SEX_LABELS[value] }))
const ACTIVITY_OPTIONS = ACTIVITY_LEVEL_VALUES.map((value) => ({
  value,
  label: ACTIVITY_LEVEL_LABELS[value],
}))

/** Order + label for the three calorie-target rows shown alongside the TDEE. */
const GOAL_ROWS: { goal: Goal; label: string }[] = [
  { goal: 'lose_weight', label: 'Déficit' },
  { goal: 'maintain', label: 'Manutenção' },
  { goal: 'gain_weight', label: 'Superávit' },
]

function formatKcal(value: number): string {
  return `${value.toLocaleString('pt-BR')} kcal`
}

export function TdeeCalculator() {
  const [result, setResult] = useState<TdeeResult | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TdeeFormInput>({ resolver: zodResolver(tdeeFormSchema) })

  function onSubmit(data: TdeeFormInput) {
    setResult(calculateTdee(data))
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Peso"
              unit="kg"
              error={errors.weightKg}
              registration={register('weightKg', { valueAsNumber: true })}
            />
            <NumberField
              label="Altura"
              unit="cm"
              error={errors.heightCm}
              registration={register('heightCm', { valueAsNumber: true })}
            />
            <NumberField
              label="Idade"
              unit="anos"
              error={errors.age}
              registration={register('age', { valueAsNumber: true })}
            />
            <SelectField
              label="Sexo utilizado pela equação"
              options={SEX_OPTIONS}
              error={errors.sex}
              registration={register('sex')}
            />
          </div>
          <SelectField
            label="Nível de atividade"
            options={ACTIVITY_OPTIONS}
            error={errors.activityLevel}
            registration={register('activityLevel')}
          />
          <Button type="submit">Calcular TDEE</Button>
        </form>
      </Card>

      {result && (
        <Card className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="text-sm text-foreground/60">TMB</span>
              <p className="text-3xl font-semibold tracking-tight">
                {formatKcal(result.bmr.value)}
              </p>
            </div>
            <div>
              <span className="text-sm text-foreground/60">TDEE (manutenção)</span>
              <p className="text-3xl font-semibold tracking-tight">{formatKcal(result.value)}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {GOAL_ROWS.map(({ goal, label }) => {
              const target = calculateCalorieTarget({
                tdee: result.value,
                goal: { type: goal, adjustmentPercentage: DEFAULT_ADJUSTMENT_PERCENTAGE[goal] },
              })
              return (
                <div key={goal} className="rounded-lg border border-foreground/10 p-3">
                  <span className="text-xs text-foreground/60">{label}</span>
                  <p className="text-lg font-medium">{formatKcal(target.value)}</p>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
