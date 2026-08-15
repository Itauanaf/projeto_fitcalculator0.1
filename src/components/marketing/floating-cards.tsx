import type { ReactNode } from 'react'
import { DonutChart } from '@/components/charts'
import { cn } from '@/lib/cn'

interface FloatingCardShellProps {
  className?: string
  children: ReactNode
  delay?: string
}

function FloatingCardShell({ className, children, delay = '0s' }: FloatingCardShellProps) {
  return (
    <div
      className={cn(
        'animate-float w-[220px] rounded-[24px] border border-white/90 bg-white/91 p-[22px]',
        'shadow-[0_22px_50px_rgba(65,75,135,0.13)] backdrop-blur-md',
        className
      )}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  )
}

export function FloatingBmiCard({ className }: { className?: string }) {
  return (
    <FloatingCardShell className={className} delay="0.2s">
      <span className="text-xs font-semibold text-text-secondary">IMC</span>
      <p className="mt-1 text-[32px] font-bold tracking-tight text-text-primary">23,4</p>
      <p className="flex items-center gap-1.5 text-xs font-medium text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" /> Peso normal
      </p>
      <p className="mt-3 text-[11px] text-text-muted">Saudável entre 18,5 e 24,9</p>
    </FloatingCardShell>
  )
}

export function FloatingTdeeCard({ className }: { className?: string }) {
  return (
    <FloatingCardShell className={className} delay="1.4s">
      <span className="text-xs font-semibold text-text-secondary">TDEE</span>
      <p className="mt-1 text-[28px] font-bold tracking-tight text-text-primary">2.350 kcal</p>
      <p className="text-[11px] text-text-muted">Gasto energético diário</p>
      <p className="mt-3 text-[11px] text-text-muted">Calculado a partir do seu perfil</p>
    </FloatingCardShell>
  )
}

const MACRO_SEGMENTS = [
  { label: 'Proteínas', grams: 120, percent: 30, color: '#554FE8' },
  { label: 'Carboidratos', grams: 210, percent: 50, color: '#8390F6' },
  { label: 'Gorduras', grams: 47, percent: 20, color: '#E7BD5B' },
]

export function FloatingMacrosCard({ className }: { className?: string }) {
  const total = MACRO_SEGMENTS.reduce((sum, m) => sum + m.grams, 0)
  return (
    <FloatingCardShell className={className} delay="0.8s">
      <span className="text-xs font-semibold text-text-secondary">Macros</span>
      <div className="mt-2 flex items-center gap-3">
        <DonutChart
          segments={MACRO_SEGMENTS.map((m) => ({ value: m.percent, color: m.color }))}
          size={52}
          strokeWidth={8}
        />
        <ul className="flex-1 space-y-1">
          {MACRO_SEGMENTS.map((macro) => (
            <li key={macro.label} className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1 text-text-secondary">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: macro.color }}
                />
                {macro.label}
              </span>
              <span className="font-semibold text-text-primary">{macro.grams}g</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[11px]">
        <span className="text-text-muted">Total</span>
        <span className="font-semibold text-text-primary">{total}g</span>
      </div>
    </FloatingCardShell>
  )
}
