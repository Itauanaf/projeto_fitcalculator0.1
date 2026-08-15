import type { Metadata } from 'next'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { CalculatorNav } from '@/components/calculator'
import { BmiCalculator } from '@/features/bmi/bmi-calculator'

export const metadata: Metadata = {
  title: 'Calculadora de IMC · FitCalculator',
  description:
    'Calcule seu Índice de Massa Corporal (IMC) e veja a faixa de peso correspondente à sua altura.',
}

export default async function BmiPage() {
  await getCurrentProfile({ redirectTo: '/calculadoras/imc' })

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <CalculatorNav />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Calculadora de IMC
        </h1>
        <p className="text-text-secondary">
          Informe seu peso e altura para calcular o Índice de Massa Corporal.
        </p>
      </div>
      <BmiCalculator />
    </div>
  )
}
