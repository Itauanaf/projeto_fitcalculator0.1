'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, NumberField } from '@/components/ui'
import { BMI_CLASSIFICATION_LABELS } from '@/constants/labels'
import {
  calculateBmi,
  calculateHealthyWeightRange,
  type BmiResult,
  type HealthyWeightRange,
} from '@/domain/calculations/bmi'
import { bmiFormSchema, type BmiFormInput } from '@/schemas/bmi.schema'

interface BmiCalculation {
  bmi: BmiResult
  range: HealthyWeightRange
}

function formatKg(value: number): string {
  return value.toFixed(1).replace('.', ',')
}

export function BmiCalculator() {
  const [result, setResult] = useState<BmiCalculation | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BmiFormInput>({ resolver: zodResolver(bmiFormSchema) })

  function onSubmit(data: BmiFormInput) {
    setResult({
      bmi: calculateBmi(data),
      range: calculateHealthyWeightRange(data.heightCm),
    })
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
          </div>
          <Button type="submit">Calcular IMC</Button>
        </form>
      </Card>

      {result && (
        <Card className="flex flex-col gap-2">
          <span className="text-sm text-foreground/60">Seu IMC</span>
          <span className="text-4xl font-semibold tracking-tight">
            {result.bmi.bmi.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-base font-medium">
            {BMI_CLASSIFICATION_LABELS[result.bmi.classification]}
          </span>
          <p className="mt-2 text-sm text-foreground/60">
            Faixa de peso correspondente à classificação normal para sua altura:{' '}
            <strong className="text-foreground">
              {formatKg(result.range.minKg)}kg – {formatKg(result.range.maxKg)}kg
            </strong>
          </p>
        </Card>
      )}
    </div>
  )
}
