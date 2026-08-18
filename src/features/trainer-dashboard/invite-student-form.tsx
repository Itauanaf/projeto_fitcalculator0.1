'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { inviteStudent } from '@/application/trainers/invite-student'
import { Button, Card, TextField } from '@/components/ui'
import { inviteStudentSchema, type InviteStudentFormInput } from '@/schemas/invite-student.schema'

/**
 * Creates an invitation and shows its link for the trainer to share
 * themselves — there's no app email delivery yet, only Supabase Auth's
 * own emails are wired up (see `inviteStudent`).
 */
export function InviteStudentForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteStudentFormInput>({ resolver: zodResolver(inviteStudentSchema) })

  async function onSubmit(data: InviteStudentFormInput) {
    setFormError(null)
    setInviteUrl(null)
    setCopied(false)
    const result = await inviteStudent(data)
    if (result.error) {
      setFormError(result.error)
      return
    }
    setInviteUrl(result.inviteUrl ?? null)
    reset()
    router.refresh()
  }

  async function copyLink() {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
  }

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-text-primary">Convidar aluno</h2>
        <p className="text-sm text-text-secondary">
          Gera um link de convite — envie você mesmo por WhatsApp, e-mail etc.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 sm:flex-row sm:items-start"
      >
        <div className="flex-1">
          <TextField
            label="E-mail do aluno"
            type="email"
            error={errors.email}
            registration={register('email')}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="mt-[26px]">
          {isSubmitting ? 'Gerando…' : 'Gerar convite'}
        </Button>
      </form>

      {formError && (
        <p role="alert" className="text-sm text-rose-500">
          {formError}
        </p>
      )}

      {inviteUrl && (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-soft p-4">
          <span className="text-xs font-medium text-text-secondary">Link do convite</span>
          <div className="flex flex-wrap items-center gap-3">
            <code className="flex-1 break-all text-sm text-text-primary">{inviteUrl}</code>
            <Button type="button" variant="secondary" onClick={copyLink}>
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
