'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { acceptInvitation } from '@/application/trainers/accept-invitation'
import { Button } from '@/components/ui'

interface AcceptInvitationButtonProps {
  token: string
}

export function AcceptInvitationButton({ token }: AcceptInvitationButtonProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleAccept() {
    setError(null)
    setIsPending(true)
    const result = await acceptInvitation(token)
    setIsPending(false)
    if (result.error) {
      setError(result.error)
      return
    }
    router.push('/app/aluno')
  }

  return (
    <div className="flex flex-col gap-3">
      <Button type="button" onClick={handleAccept} disabled={isPending} className="w-full sm:w-fit">
        {isPending ? 'Aceitando…' : 'Aceitar convite'}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-rose-500">
          {error}
        </p>
      )}
    </div>
  )
}
