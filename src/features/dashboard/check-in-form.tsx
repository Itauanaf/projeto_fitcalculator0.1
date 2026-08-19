'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ClipboardCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { submitCheckIn } from '@/application/students/submit-check-in'
import {
  Button,
  Card,
  NumberField,
  SectionHeader,
  StarRatingField,
  TextareaField,
} from '@/components/ui'
import {
  studentCheckInSchema,
  type StudentCheckInFormInput,
} from '@/schemas/student-check-in.schema'

/** The student's periodic check-in — weight plus a few subjective ratings and free-text notes. */
export function CheckInForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentCheckInFormInput>({
    resolver: zodResolver(studentCheckInSchema),
    defaultValues: {
      energyLevel: 3,
      hungerLevel: 3,
      sleepQuality: 3,
      workoutsCompleted: 0,
      nutritionAdherencePercentage: 80,
    },
  })

  async function onSubmit(data: StudentCheckInFormInput) {
    setFormError(null)
    setSubmitted(false)
    const result = await submitCheckIn(data)
    if (result.error) {
      setFormError(result.error)
      return
    }
    setSubmitted(true)
    reset({
      weightKg: undefined,
      energyLevel: 3,
      hungerLevel: 3,
      sleepQuality: 3,
      workoutsCompleted: 0,
      nutritionAdherencePercentage: 80,
      notes: '',
    })
    router.refresh()
  }

  return (
    <Card className="flex flex-col gap-5">
      <SectionHeader
        icon={ClipboardCheck}
        title="Fazer check-in"
        subtitle="Registra seu peso e como foi sua semana — gera um novo cálculo de IMC, TDEE e macros."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <NumberField
          label="Peso"
          unit="kg"
          error={errors.weightKg}
          registration={register('weightKg', { valueAsNumber: true })}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <StarRatingField
            name="energyLevel"
            control={control}
            label="Nível de energia"
            error={errors.energyLevel}
          />
          <StarRatingField
            name="hungerLevel"
            control={control}
            label="Nível de fome"
            error={errors.hungerLevel}
          />
          <StarRatingField
            name="sleepQuality"
            control={control}
            label="Qualidade do sono"
            error={errors.sleepQuality}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="Treinos realizados na semana"
            error={errors.workoutsCompleted}
            registration={register('workoutsCompleted', { valueAsNumber: true })}
          />
          <NumberField
            label="Aderência à alimentação"
            unit="%"
            error={errors.nutritionAdherencePercentage}
            registration={register('nutritionAdherencePercentage', { valueAsNumber: true })}
          />
        </div>

        <TextareaField label="Observações" error={errors.notes} registration={register('notes')} />

        {formError && (
          <p role="alert" className="text-sm text-rose-500">
            {formError}
          </p>
        )}
        {submitted && !formError && (
          <p className="text-sm text-emerald-600">Check-in registrado.</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-fit">
          {isSubmitting ? 'Enviando…' : 'Enviar check-in'}
        </Button>
      </form>
    </Card>
  )
}
