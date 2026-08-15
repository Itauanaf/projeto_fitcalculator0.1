import type { Metadata } from 'next'
import { getCurrentProfile } from '@/application/authorization/get-current-profile'
import { CalculatorNav } from '@/components/calculator'
import { TdeeCalculator } from '@/features/tdee/tdee-calculator'

export const metadata: Metadata = {
  title: 'Calculadora de TDEE · FitCalculator',
  description:
    'Calcule sua Taxa Metabólica Basal (TMB) e seu Gasto Energético Total Diário (TDEE) a partir do seu nível de atividade.',
}

export default async function TdeePage() {
  await getCurrentProfile({ redirectTo: '/calculadoras/tdee' })

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <CalculatorNav />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Calculadora de TDEE
        </h1>
        <p className="text-text-secondary">
          Informe seus dados e nível de atividade para calcular sua TMB e seu gasto calórico diário
          total.
        </p>
      </div>
      <TdeeCalculator />
    </div>
  )
}
