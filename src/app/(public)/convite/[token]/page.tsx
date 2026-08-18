import type { Metadata } from 'next'
import { assertRole } from '@/application/authorization/assert-role'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { getInvitationByToken } from '@/application/trainers/get-invitation-by-token'
import { Card } from '@/components/ui'
import { canAcceptInvitation, isInvitationExpired } from '@/domain/entities/student-invitation'
import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'
import { AcceptInvitationButton } from '@/features/trainer-dashboard'

export const metadata: Metadata = {
  title: 'Convite de personal trainer · FitCalculator',
}

function InviteMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <Card>
        <p className="text-text-secondary">{children}</p>
      </Card>
    </div>
  )
}

export default async function InvitationPage({ params }: PageProps<'/convite/[token]'>) {
  const { token } = await params

  const invitation = await getInvitationByToken(token)

  if (!invitation) {
    return <InviteMessage>Convite não encontrado. Confira se o link está completo.</InviteMessage>
  }
  if (invitation.status === 'accepted') {
    return <InviteMessage>Este convite já foi aceito.</InviteMessage>
  }
  if (invitation.status === 'cancelled') {
    return <InviteMessage>Este convite foi cancelado pelo personal trainer.</InviteMessage>
  }
  if (invitation.status === 'expired' || isInvitationExpired(invitation)) {
    return (
      <InviteMessage>
        Este convite expirou. Peça ao personal trainer para enviar outro.
      </InviteMessage>
    )
  }
  if (!canAcceptInvitation(invitation)) {
    return <InviteMessage>Este convite não está mais disponível.</InviteMessage>
  }

  // Requires an account — same `next=` round trip the calculators use for a signed-out visitor.
  const profile = await getCurrentProfile({ redirectTo: `/convite/${token}` })
  assertRole(profile, ['student'])

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const emailMatches = user?.email?.toLowerCase() === invitation.email.toLowerCase()

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-text-primary">
            Convite de {invitation.trainerName}
          </h1>
          <p className="text-sm text-text-secondary">
            {invitation.trainerName} quer acompanhar seu progresso no FitCalculator.
          </p>
        </div>

        {emailMatches ? (
          <AcceptInvitationButton token={token} />
        ) : (
          <p className="text-sm text-text-secondary">
            Este convite foi enviado para <strong>{invitation.email}</strong>, um e-mail diferente
            do da sua conta atual. Entre com a conta correta para aceitar.
          </p>
        )}
      </Card>
    </div>
  )
}
