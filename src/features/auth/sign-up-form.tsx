'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { signUp } from '@/application/auth/sign-up'
import { Button, Card, TextField } from '@/components/ui'
import { cn } from '@/lib/cn'
import { signUpSchema, type SignUpInput } from '@/schemas/auth.schema'

const ROLE_OPTIONS = [
  {
    value: 'student',
    label: 'Sou aluno',
    description: 'Quero acompanhar meu próprio progresso.',
  },
  {
    value: 'trainer',
    label: 'Sou personal trainer',
    description: 'Quero acompanhar meus alunos.',
  },
] as const

export function SignUpForm() {
  const [formError, setFormError] = useState<string | null>(null)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: 'student' },
  })

  const role = useWatch({ control, name: 'role' })

  async function onSubmit(data: SignUpInput) {
    setFormError(null)
    const result = await signUp(data)
    if (result?.error) setFormError(result.error)
    if (result?.needsEmailConfirmation) setNeedsEmailConfirmation(true)
  }

  if (needsEmailConfirmation) {
    return (
      <Card className="text-center">
        <h1 className="text-xl font-semibold text-text-primary">Confira seu e-mail</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Enviamos um link de confirmação para ativar sua conta. Pode fechar esta página.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-text-primary">Criar conta</h1>
          <p className="text-sm text-text-secondary">Leva menos de um minuto.</p>
        </div>

        <div
          role="radiogroup"
          aria-label="Você é aluno ou personal trainer?"
          className="grid grid-cols-2 gap-3"
        >
          {ROLE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                'cursor-pointer rounded-2xl border p-4 text-sm transition-colors',
                role === option.value
                  ? 'border-primary bg-primary-soft'
                  : 'border-border hover:border-primary/40'
              )}
            >
              <input type="radio" value={option.value} className="sr-only" {...register('role')} />
              <span className="block font-semibold text-text-primary">{option.label}</span>
              <span className="mt-1 block text-xs text-text-secondary">{option.description}</span>
            </label>
          ))}
        </div>
        {errors.role && (
          <p role="alert" className="-mt-3 text-xs text-rose-500">
            {errors.role.message}
          </p>
        )}

        <TextField
          label="Nome completo"
          autoComplete="name"
          error={errors.fullName}
          registration={register('fullName')}
        />
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
          autoComplete="new-password"
          error={errors.password}
          registration={register('password')}
        />
        <TextField
          label="Confirmar senha"
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
          {isSubmitting ? 'Criando conta…' : 'Criar conta'}
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </Card>
  )
}
