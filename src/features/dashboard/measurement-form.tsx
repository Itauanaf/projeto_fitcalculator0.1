'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { logMeasurement } from '@/application/students/log-measurement'
import { Button, Card, NumberField } from '@/components/ui'
import { asOptionalNumber } from '@/lib/forms'
import {
  studentMeasurementSchema,
  type StudentMeasurementFormInput,
} from '@/schemas/student-measurement.schema'

/** Logs a new weight (+ optional body fat / waist) entry and recomputes the dashboard's numbers from it. */
export function MeasurementForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentMeasurementFormInput>({ resolver: zodResolver(studentMeasurementSchema) })

  async function onSubmit(data: StudentMeasurementFormInput) {
    setFormError(null)
    const result = await logMeasurement(data)
    if (result.error) {
      setFormError(result.error)
      return
    }
    reset()
    router.refresh()
  }

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-text-primary">Registrar medição</h2>
        <p className="text-sm text-text-secondary">
          Cada peso registrado gera um novo cálculo — o histórico nunca é sobrescrito.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-3">
          <NumberField
            label="Peso"
            unit="kg"
            error={errors.weightKg}
            registration={register('weightKg', { valueAsNumber: true })}
          />
          <NumberField
            label="% de gordura"
            unit="opcional"
            error={errors.bodyFatPercentage}
            registration={register('bodyFatPercentage', { setValueAs: asOptionalNumber })}
          />
          <NumberField
            label="Cintura"
            unit="cm, opcional"
            error={errors.waistCm}
            registration={register('waistCm', { setValueAs: asOptionalNumber })}
          />
        </div>

        {formError && (
          <p role="alert" className="text-sm text-rose-500">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-fit">
          {isSubmitting ? 'Registrando…' : 'Registrar medição'}
        </Button>
      </form>
    </Card>
  )
}
