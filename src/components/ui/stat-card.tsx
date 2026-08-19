import type { LucideIcon } from 'lucide-react'
import { Card } from './card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
}

/** One KPI tile — icon, label, big value, optional hint below. The dashboards' top row is a grid of these. */
export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>
      <div>
        <span className="text-xs font-medium text-text-secondary">{label}</span>
        <p className="text-2xl font-bold tracking-tight text-text-primary">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-text-secondary">{hint}</p>}
      </div>
    </Card>
  )
}
