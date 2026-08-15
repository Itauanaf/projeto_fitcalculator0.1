'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { setGoal } from '@/application/students/set-goal'
import { Button, Card, NumberField, SelectField } from '@/components/ui'
import { GOAL_LABELS } from '@/constants/labels'
import { DEFAULT_ADJUSTMENT_PERCENTAGE } from '@/domain/calculations/calories'
import { GOAL_VALUES, type Goal } from '@/domain/value-objects/goal'
import { asOptionalNumber } from '@/lib/forms'
import { studentGoalSchema, type StudentGoalFormInput } from '@/schemas/student-goal.schema'

const GOAL_OPTIONS = GOAL_VALUES.map((value) => ({ value, label: GOAL_LABELS[value] }))

export interface GoalFormInitialValues {
  type: Goal
  targetWeightKg?: number
  calorieAdjustmentPercent: number
}

interface GoalFormProps {
  initialValues?: GoalFormInitialValues
}

export function GoalForm({ initialValues }: GoalFormProps) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentGoalFormInput>({
    resolver: zodResolver(studentGoalSchema),
    defaultValues: initialValues ?? { type: 'maintain', calorieAdjustmentPercent: 0 },
  })

  async function onSubmit(data: StudentGoalFormInput) {
    setFormError(null)
    const result = await setGoal(data)
    if (result.error) {
      setFormError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-text-primary">
          {initialValues ? 'Alterar objetivo' : 'Definir objetivo'}
        </h2>
        <p className="text-sm text-text-secondary">
          Define o ajuste calórico aplicado sobre o TDEE ao calcular sua meta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Objetivo"
            options={GOAL_OPTIONS}
            error={errors.type}
            registration={register('type', {
              onChange: (e) => {
                const type = e.target.value as Goal
                setValue('calorieAdjustmentPercent', DEFAULT_ADJUSTMENT_PERCENTAGE[type])
              },
            })}
          />
          <NumberField
            label="Ajuste sobre o TDEE"
            unit="%"
            error={errors.calorieAdjustmentPercent}
            registration={register('calorieAdjustmentPercent', { valueAsNumber: true })}
          />
        </div>
        <NumberField
          label="Peso alvo"
          unit="kg, opcional"
          error={errors.targetWeightKg}
          registration={register('targetWeightKg', { setValueAs: asOptionalNumber })}
        />

        {formError && (
          <p role="alert" className="text-sm text-rose-500">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-fit">
          {isSubmitting ? 'Salvando…' : 'Salvar objetivo'}
        </Button>
      </form>
    </Card>
  )
}
