'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarClock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { setCheckInFrequency } from '@/application/trainers/set-check-in-frequency'
import { Button, Card, SectionHeader, SelectField } from '@/components/ui'
import { CHECK_IN_FREQUENCY_LABELS } from '@/constants/labels'
import { CHECK_IN_FREQUENCY_VALUES } from '@/domain/value-objects/check-in-frequency'
import type { CheckInSchedule } from '@/infrastructure/repositories/trainer-repository'
import {
  setCheckInFrequencySchema,
  type SetCheckInFrequencyFormInput,
} from '@/schemas/check-in-frequency.schema'

const FREQUENCY_OPTIONS = CHECK_IN_FREQUENCY_VALUES.map((value) => ({
  value,
  label: CHECK_IN_FREQUENCY_LABELS[value],
}))

/**
 * `nextCheckInAt` is a real timestamp (not a `@db.Date` value), so —
 * unlike `formatDateOnly` — this reads it in the viewer's own local
 * time, matching how every other timestamp in the app is displayed.
 */
function formatScheduledDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface CheckInFrequencyFormProps {
  studentId: string
  schedule: CheckInSchedule | null
}

/** Lets the trainer set how often this student is expected to check in. */
export function CheckInFrequencyForm({ studentId, schedule }: CheckInFrequencyFormProps) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetCheckInFrequencyFormInput>({
    resolver: zodResolver(setCheckInFrequencySchema),
    defaultValues: { frequency: schedule?.frequency ?? 'weekly' },
  })

  async function onSubmit(data: SetCheckInFrequencyFormInput) {
    setFormError(null)
    const result = await setCheckInFrequency(studentId, data)
    if (result.error) {
      setFormError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader icon={CalendarClock} title="Frequência do check-in" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4">
        <div className="flex-1">
          <SelectField
            label="Frequência"
            options={FREQUENCY_OPTIONS}
            error={errors.frequency}
            registration={register('frequency')}
          />
        </div>
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando…' : 'Salvar'}
        </Button>
      </form>

      {formError && (
        <p role="alert" className="text-sm text-rose-500">
          {formError}
        </p>
      )}

      {schedule?.nextCheckInAt && (
        <p className="text-sm text-text-secondary">
          Próximo check-in:{' '}
          <span className="font-medium text-text-primary">
            {formatScheduledDate(schedule.nextCheckInAt)}
          </span>
        </p>
      )}
    </Card>
  )
}
