'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from '@/application/auth/sign-in'
import { Button, Card, TextField } from '@/components/ui'
import { loginSchema, type LoginInput } from '@/schemas/auth.schema'

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setFormError(null)
    const result = await signIn(data)
    if (result?.error) setFormError(result.error)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-text-primary">Entrar</h1>
          <p className="text-sm text-text-secondary">Acesse sua conta FitCalculator.</p>
        </div>

        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email}
          registration={register('email')}
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.password}
          registration={register('password')}
        />

        {formError && (
          <p role="alert" className="text-sm text-rose-500">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>

        <div className="flex items-center justify-between text-sm">
          <Link href="/recuperar-senha" className="text-text-secondary hover:text-primary">
            Esqueci minha senha
          </Link>
          <Link href="/cadastro" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </div>
      </form>
    </Card>
  )
}
