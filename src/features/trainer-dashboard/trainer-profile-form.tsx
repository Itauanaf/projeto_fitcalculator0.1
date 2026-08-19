'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { saveTrainerProfile } from '@/application/trainers/save-trainer-profile'
import { Button, Card, SectionHeader, TextareaField, TextField } from '@/components/ui'
import {
  trainerProfileSchema,
  type TrainerProfileFormInput,
} from '@/schemas/trainer-profile.schema'

interface TrainerProfileFormProps {
  initialValues?: TrainerProfileFormInput
}

/** Every field here is optional — filling it in just makes the trainer's invites feel more personal. */
export function TrainerProfileForm({ initialValues }: TrainerProfileFormProps) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrainerProfileFormInput>({
    resolver: zodResolver(trainerProfileSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(data: TrainerProfileFormInput) {
    setFormError(null)
    setSaved(false)
    const result = await saveTrainerProfile(data)
    if (result.error) {
      setFormError(result.error)
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <SectionHeader
          icon={UserRound}
          title="Seu perfil"
          subtitle="Opcional — aparece para os alunos que você convidar."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Telefone" error={errors.phone} registration={register('phone')} />
          <TextField label="CREF" error={errors.cref} registration={register('cref')} />
        </div>
        <TextareaField label="Bio" error={errors.bio} registration={register('bio')} />

        {formError && (
          <p role="alert" className="text-sm text-rose-500">
            {formError}
          </p>
        )}
        {saved && !formError && <p className="text-sm text-emerald-600">Perfil salvo.</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-fit">
          {isSubmitting ? 'Salvando…' : 'Salvar'}
        </Button>
      </form>
    </Card>
  )
}
