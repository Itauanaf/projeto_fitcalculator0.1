'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { requestPasswordReset } from '@/application/auth/request-password-reset'
import { Button, Card, TextField } from '@/components/ui'
import { requestPasswordResetSchema, type RequestPasswordResetInput } from '@/schemas/auth.schema'

export function RequestPasswordResetForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetInput>({ resolver: zodResolver(requestPasswordResetSchema) })

  async function onSubmit(data: RequestPasswordResetInput) {
    await requestPasswordReset(data)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card className="text-center">
        <h1 className="text-xl font-semibold text-text-primary">Confira seu e-mail</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-text-primary">Recuperar senha</h1>
          <p className="text-sm text-text-secondary">
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email}
          registration={register('email')}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Enviando…' : 'Enviar link'}
        </Button>

        <p className="text-center text-sm text-text-secondary">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Voltar para o login
          </Link>
        </p>
      </form>
    </Card>
  )
}
