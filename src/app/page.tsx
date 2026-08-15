import type { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui'

export const metadata: Metadata = {
  title: 'FitCalculator',
  description:
    'Calcule IMC, TMB, TDEE, meta calórica e macronutrientes de forma simples, num só lugar.',
}

const CALCULATORS = [
  {
    href: '/calculadoras/imc',
    title: 'IMC',
    description: 'Índice de Massa Corporal a partir do seu peso e altura.',
  },
  {
    href: '/calculadoras/tdee',
    title: 'TDEE',
    description: 'Gasto calórico diário total, a partir da sua TMB e nível de atividade.',
  },
  {
    href: '/calculadoras/macros',
    title: 'Macronutrientes',
    description: 'Proteína, carboidrato e gordura para a sua meta calórica.',
  },
] as const

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">FitCalculator</h1>
        <p className="text-lg text-foreground/60">
          Calcule suas necessidades de composição corporal e energéticas de forma simples.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CALCULATORS.map((calculator) => (
          <Link key={calculator.href} href={calculator.href}>
            <Card className="flex h-full flex-col gap-2 transition-colors hover:border-foreground/30">
              <span className="text-lg font-medium">{calculator.title}</span>
              <span className="text-sm text-foreground/60">{calculator.description}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
