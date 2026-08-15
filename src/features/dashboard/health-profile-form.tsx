'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { saveHealthProfile } from '@/application/students/save-health-profile'
import { Button, Card, NumberField, SelectField, TextField } from '@/components/ui'
import { ACTIVITY_LEVEL_LABELS, MACRO_STRATEGY_LABELS, SEX_LABELS } from '@/constants/labels'
import { ACTIVITY_LEVEL_VALUES } from '@/domain/value-objects/activity-level'
import { MACRO_STRATEGY_VALUES } from '@/domain/value-objects/macro-strategy'
import { SEX_VALUES } from '@/domain/value-objects/sex'
import {
  studentHealthProfileSchema,
  type StudentHealthProfileFormInput,
} from '@/schemas/student-health-profile.schema'

const SEX_OPTIONS = SEX_VALUES.map((value) => ({ value, label: SEX_LABELS[value] }))
const ACTIVITY_OPTIONS = ACTIVITY_LEVEL_VALUES.map((value) => ({
  value,
  label: ACTIVITY_LEVEL_LABELS[value],
}))
const MACRO_STRATEGY_OPTIONS = MACRO_STRATEGY_VALUES.map((value) => ({
  value,
  label: MACRO_STRATEGY_LABELS[value],
}))

/** Percent input (0-100) stored as a fraction (0-1), matching the standalone macros calculator. */
const asFraction = (raw: string) => (raw === '' ? undefined : Number(raw) / 100)

/** UTC getters — a bare `YYYY-MM-DD` parses as UTC midnight, see the schema for why. */
function formatDateInput(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export interface HealthProfileFormInitialValues {
  birthDate: Date
  heightCm: number
  sex: StudentHealthProfileFormInput['sex']
  activityLevel: StudentHealthProfileFormInput['activityLevel']
  macroStrategy: StudentHealthProfileFormInput['macroStrategy']
  customProteinPercentage?: number
  customCarbsPercentage?: number
  customFatPercentage?: number
}

interface HealthProfileFormProps {
  initialValues?: HealthProfileFormInitialValues
  /** Shown once when there's no profile yet — nudges the student to fill it in before anything else works. */
  isOnboarding?: boolean
}

export function HealthProfileForm({ initialValues, isOnboarding }: HealthProfileFormProps) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StudentHealthProfileFormInput>({
    resolver: zodResolver(studentHealthProfileSchema),
    defaultValues: initialValues
      ? {
          birthDate: formatDateInput(initialValues.birthDate),
          heightCm: initialValues.heightCm,
          sex: initialValues.sex,
          activityLevel: initialValues.activityLevel,
          macroStrategy: initialValues.macroStrategy,
          customDistribution:
            initialValues.macroStrategy === 'custom'
              ? {
                  protein: (initialValues.customProteinPercentage ?? 0) / 100,
                  carbs: (initialValues.customCarbsPercentage ?? 0) / 100,
                  fat: (initialValues.customFatPercentage ?? 0) / 100,
                }
              : undefined,
        }
      : undefined,
  })

  // `useWatch` (not `formState`'s `watch`) so React Compiler can still memoize this component.
  const strategy = useWatch({ control, name: 'macroStrategy' })

  async function onSubmit(data: StudentHealthProfileFormInput) {
    setFormError(null)
    const result = await saveHealthProfile(data)
    if (result.error) {
      setFormError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-text-primary">
            {isOnboarding ? 'Complete seu perfil de saúde' : 'Perfil de saúde'}
          </h2>
          <p className="text-sm text-text-secondary">
            {isOnboarding
              ? 'Precisamos desses dados para calcular seu IMC, TDEE e macros.'
              : 'Usado para calcular seu IMC, TDEE e macros a cada nova medição.'}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Data de nascimento"
            type="date"
            error={errors.birthDate}
            registration={register('birthDate')}
          />
          <NumberField
            label="Altura"
            unit="cm"
            error={errors.heightCm}
            registration={register('heightCm', { valueAsNumber: true })}
          />
          <SelectField
            label="Sexo utilizado pela equação"
            options={SEX_OPTIONS}
            error={errors.sex}
            registration={register('sex')}
          />
          <SelectField
            label="Nível de atividade"
            options={ACTIVITY_OPTIONS}
            error={errors.activityLevel}
            registration={register('activityLevel')}
          />
        </div>

        <SelectField
          label="Estratégia de macros"
          options={MACRO_STRATEGY_OPTIONS}
          error={errors.macroStrategy}
          registration={register('macroStrategy')}
        />

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

        {formError && (
          <p role="alert" className="text-sm text-rose-500">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-fit">
          {isSubmitting ? 'Salvando…' : 'Salvar perfil'}
        </Button>
      </form>
    </Card>
  )
}
