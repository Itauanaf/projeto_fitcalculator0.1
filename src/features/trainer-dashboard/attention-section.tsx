import { AlertTriangle, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { AttentionItem } from '@/application/trainers/get-trainer-dashboard'
import { Avatar, Card, SectionHeader } from '@/components/ui'
import { ATTENTION_FLAG_LABELS } from '@/constants/labels'

const CTA_LABEL: Record<AttentionItem['flag']['kind'], string> = {
  no_check_in: 'Ver aluno',
  no_weight_update: 'Ver aluno',
  weight_change: 'Ver evolução',
  incomplete_profile: 'Ver aluno',
  goal_reached: 'Ver progresso',
  near_goal: 'Ver progresso',
  low_adherence: 'Ver aluno',
}

interface AttentionSectionProps {
  items: AttentionItem[]
}

/**
 * "Precisam de atenção" — every operational flag across every student,
 * one row each. Never a medical judgment, only "this changed" or "this
 * is late" (doc section 4/20) — the wording itself lives in
 * `ATTENTION_FLAG_LABELS`.
 */
export function AttentionSection({ items }: AttentionSectionProps) {
  if (items.length === 0) {
    return (
      <Card className="flex flex-col gap-2">
        <SectionHeader icon={AlertTriangle} title="Precisam de atenção" />
        <p className="text-text-secondary">Nenhum aluno precisa de atenção agora.</p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader icon={AlertTriangle} title="Precisam de atenção" />
      <ul className="flex flex-col divide-y divide-border">
        {items.map((item, index) => (
          <li key={`${item.studentId}-${item.flag.kind}-${index}`} className="py-3">
            <Link
              href={`/app/personal/alunos/${item.studentId}`}
              className="flex items-center justify-between gap-4 rounded-xl transition-colors hover:text-primary"
            >
              <div className="flex items-center gap-3">
                <Avatar name={item.fullName} size="sm" />
                <div>
                  <p className="font-semibold text-text-primary">{item.fullName}</p>
                  <p className="text-sm text-text-secondary">
                    {ATTENTION_FLAG_LABELS[item.flag.kind](item.flag)}
                  </p>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                {CTA_LABEL[item.flag.kind]}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
