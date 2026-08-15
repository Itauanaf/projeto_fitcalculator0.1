'use client'

import { ArrowLeft, Flame, PieChart, Scale } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const CALCULATORS = [
  { href: '/calculadoras/imc', label: 'IMC', icon: Scale },
  { href: '/calculadoras/tdee', label: 'TDEE', icon: Flame },
  { href: '/calculadoras/macros', label: 'Macros', icon: PieChart },
] as const

/**
 * Sits above the title on every calculator page: a way back to the
 * home page, plus a switcher to jump straight to another calculator
 * without backtracking through it.
 */
export function CalculatorNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar
      </Link>

      <div
        role="tablist"
        aria-label="Escolher calculadora"
        className="inline-flex gap-1 rounded-full bg-surface-soft p-1"
      >
        {CALCULATORS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-[#625CF3] to-primary-hover text-white shadow-[0_6px_16px_rgba(81,71,232,0.25)]'
                  : 'text-text-secondary hover:text-primary'
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
