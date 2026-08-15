'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button, Card, NumberField, SelectField } from '@/components/ui'
import {
  ACTIVITY_LEVEL_LABELS,
  GOAL_LABELS,
  MACRO_STRATEGY_LABELS,
  SEX_LABELS,
} from '@/constants/labels'
import {
  calculateCalorieTarget,
  DEFAULT_ADJUSTMENT_PERCENTAGE,
} from '@/domain/calculations/calories'
import { calculateMacros, type MacroResult } from '@/domain/calculations/macros'
import { calculateTdee } from '@/domain/calculations/tdee'
import { ACTIVITY_LEVEL_VALUES } from '@/domain/value-objects/activity-level'
import { GOAL_VALUES } from '@/domain/value-objects/goal'
import { MACRO_STRATEGY_VALUES } from '@/domain/value-objects/macro-strategy'
import { SEX_VALUES } from '@/domain/value-objects/sex'
import { macrosFormSchema, type MacrosFormInput } from '@/schemas/macros.schema'

const SEX_OPTIONS = SEX_VALUES.map((value) => ({ value, label: SEX_LABELS[value] }))
const ACTIVITY_OPTIONS = ACTIVITY_LEVEL_VALUES.map((value) => ({
  value,
  label: ACTIVITY_LEVEL_LABELS[value],
}))
const GOAL_OPTIONS = GOAL_VALUES.map((value) => ({ value, label: GOAL_LABELS[value] }))
const MACRO_STRATEGY_OPTIONS = MACRO_STRATEGY_VALUES.map((value) => ({
  value,
  label: MACRO_STRATEGY_LABELS[value],
}))

/** Percent input (0-100) stored as a fraction (0-1), matching the domain's `MacroDistribution` shape. */
const asFraction = (raw: string) => (raw === '' ? undefined : Number(raw) / 100)

function formatKcal(value: number): string {
  return `${value.toLocaleString('pt-BR')} kcal`
}

export function MacrosCalculator() {
  const [result, setResult] = useState<MacroResult | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MacrosFormInput>({ resolver: zodResolver(macrosFormSchema) })

  // `useWatch` (not `formState`'s `watch`) so React Compiler can still
  // memoize this component.
  const strategy = useWatch({ control, name: 'macroStrategy' })

  function onSubmit(data: MacrosFormInput) {
    const tdee = calculateTdee(data)
    const calorieTarget = calculateCalorieTarget({
      tdee: tdee.value,
      goal: { type: data.goal, adjustmentPercentage: DEFAULT_ADJUSTMENT_PERCENTAGE[data.goal] },
    })
    setResult(
      calculateMacros({
        calorieTarget: calorieTarget.value,
        strategy: data.macroStrategy,
        customDistribution: data.customDistribution,
      })
    )
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
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Objetivo"
              options={GOAL_OPTIONS}
              error={errors.goal}
              registration={register('goal')}
            />
            <SelectField
              label="Estratégia alimentar"
              options={MACRO_STRATEGY_OPTIONS}
              error={errors.macroStrategy}
              registration={register('macroStrategy')}
            />
          </div>

          {strategy === 'custom' && (
            <div className="grid gap-5 sm:grid-cols-3">
              <NumberField
                label="Proteína"
                unit="%"
                error={errors.customDistribution?.protein}
                registration={register('customDistribution.protein', { setValueAs: asFraction })}
              />
              <NumberField
                label="Carboidrato"
                unit="%"
                error={errors.customDistribution?.carbs}
                registration={register('customDistribution.carbs', { setValueAs: asFraction })}
              />
              <NumberField
                label="Gordura"
                unit="%"
                error={errors.customDistribution?.fat}
                registration={register('customDistribution.fat', { setValueAs: asFraction })}
              />
            </div>
          )}

          <Button type="submit">Calcular macros</Button>
        </form>
      </Card>

      {result && (
        <Card className="flex flex-col gap-4">
          <div>
            <span className="text-sm text-foreground/60">Meta calórica</span>
            <p className="text-3xl font-semibold tracking-tight">
              {formatKcal(result.calorieTarget)}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-foreground/10 p-3">
              <span className="text-xs text-foreground/60">
                Proteína · {Math.round(result.distribution.protein * 100)}%
              </span>
              <p className="text-lg font-medium">{result.grams.protein}g</p>
            </div>
            <div className="rounded-lg border border-foreground/10 p-3">
              <span className="text-xs text-foreground/60">
                Carboidratos · {Math.round(result.distribution.carbs * 100)}%
              </span>
              <p className="text-lg font-medium">{result.grams.carbs}g</p>
            </div>
            <div className="rounded-lg border border-foreground/10 p-3">
              <span className="text-xs text-foreground/60">
                Gorduras · {Math.round(result.distribution.fat * 100)}%
              </span>
              <p className="text-lg font-medium">{result.grams.fat}g</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
