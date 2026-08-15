import { RefreshCw, ShieldCheck, Sparkles, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ShieldCheck, title: '100% Seguro', description: 'Seus dados protegidos' },
  { icon: Target, title: 'Cálculos precisos', description: 'Baseados em ciência' },
  {
    icon: Sparkles,
    title: 'Para todos os objetivos',
    description: 'Emagrecer, ganhar massa ou manter',
  },
  {
    icon: RefreshCw,
    title: 'Atualizações constantes',
    description: 'Sempre com o melhor para você',
  },
]

export function BenefitsBar() {
  return (
    <div className="mx-auto w-full max-w-[1050px] rounded-[22px] border border-white/70 bg-white/64 px-6 py-6 shadow-[0_18px_45px_rgba(53,67,140,0.08)] backdrop-blur-xl sm:py-0">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-center gap-3 py-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">{title}</p>
              <p className="truncate text-xs text-text-muted">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
