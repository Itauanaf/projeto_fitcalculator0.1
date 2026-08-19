import { AlertCircle, CalendarCheck, CalendarClock } from 'lucide-react'
import type { CheckInStatus } from '@/domain/calculations/check-in-schedule'

interface CheckInPendingBannerProps {
  status: CheckInStatus
}

/**
 * "Seu check-in está disponível" / "Check-in pendente há X dias" — sits
 * above the check-in form. Renders nothing for `not_scheduled` (no
 * trainer yet, or the trainer set the frequency to manual) or `upcoming`
 * more than a few days out — a banner every single day would just become noise.
 */
export function CheckInPendingBanner({ status }: CheckInPendingBannerProps) {
  if (status.kind === 'not_scheduled') return null
  if (status.kind === 'upcoming' && status.dueInDays > 3) return null

  if (status.kind === 'overdue') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm font-medium text-amber-800">
          Check-in pendente há {status.daysOverdue} {status.daysOverdue === 1 ? 'dia' : 'dias'}.
        </p>
      </div>
    )
  }

  if (status.kind === 'due') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary-soft px-5 py-4">
        <CalendarCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-sm font-medium text-text-primary">Seu check-in está disponível.</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-soft px-5 py-4">
      <CalendarClock className="h-5 w-5 shrink-0 text-text-secondary" aria-hidden="true" />
      <p className="text-sm text-text-secondary">
        Próximo check-in em {status.dueInDays} {status.dueInDays === 1 ? 'dia' : 'dias'}.
      </p>
    </div>
  )
}
