import { Mail } from 'lucide-react'
import { Badge, Card, SectionHeader } from '@/components/ui'
import { INVITATION_STATUS_LABELS, INVITATION_STATUS_TONE } from '@/constants/labels'
import type { StudentInvitationRecord } from '@/infrastructure/repositories/trainer-repository'

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface InvitationsListProps {
  invitations: StudentInvitationRecord[]
}

/** Every invitation this trainer has ever sent, newest first — including expired/accepted ones, for a full trail. */
export function InvitationsList({ invitations }: InvitationsListProps) {
  if (invitations.length === 0) {
    return null
  }

  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader icon={Mail} title="Convites enviados" />
      <ul className="flex flex-col divide-y divide-border">
        {invitations.map((invitation) => (
          <li
            key={invitation.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-sm"
          >
            <span className="font-medium text-text-primary">{invitation.email}</span>
            <span className="flex items-center gap-3">
              <span className="text-text-secondary">{formatDate(invitation.createdAt)}</span>
              <Badge tone={INVITATION_STATUS_TONE[invitation.status]}>
                {INVITATION_STATUS_LABELS[invitation.status]}
              </Badge>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
