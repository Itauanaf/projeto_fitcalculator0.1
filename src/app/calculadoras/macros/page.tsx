import type { Metadata } from 'next'
import { CalculatorNav } from '@/components/calculator'
import { MacrosCalculator } from '@/features/macros/macros-calculator'

export const metadata: Metadata = {
  title: 'Calculadora de Macronutrientes · FitCalculator',
  description:
    'Calcule sua meta calórica e a distribuição de proteína, carboidrato e gordura para o seu objetivo.',
}

export default function MacrosPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <CalculatorNav />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Calculadora de Macronutrientes
        </h1>
        <p className="text-text-secondary">
          Informe seus dados, objetivo e estratégia alimentar para calcular sua meta calórica e seus
          macros.
        </p>
      </div>
      <MacrosCalculator />
    </div>
  )
}
