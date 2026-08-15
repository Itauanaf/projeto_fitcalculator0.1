'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { updatePassword } from '@/application/auth/update-password'
import { Button, Card, TextField } from '@/components/ui'
import { updatePasswordSchema, type UpdatePasswordInput } from '@/schemas/auth.schema'

export function UpdatePasswordForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordInput>({ resolver: zodResolver(updatePasswordSchema) })

  async function onSubmit(data: UpdatePasswordInput) {
    setFormError(null)
    const result = await updatePassword(data)
    if (result.error) {
      setFormError(result.error)
      return
    }
    router.push('/login?atualizada=1')
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-text-primary">Nova senha</h1>
          <p className="text-sm text-text-secondary">Escolha uma nova senha para sua conta.</p>
        </div>

        <TextField
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          error={errors.password}
          registration={register('password')}
        />
        <TextField
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          registration={register('confirmPassword')}
        />

        {formError && (
          <p role="alert" className="text-sm text-rose-500">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Salvando…' : 'Salvar nova senha'}
        </Button>
      </form>
    </Card>
  )
}
