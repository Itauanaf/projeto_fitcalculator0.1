import { ChevronRight, Flame, PieChart, Scale } from 'lucide-react'
import { LinkButton } from '@/components/ui'
import { DonutChart, MiniBarChart, SemicircleGauge } from '@/components/charts'

const CALCULATORS = [
  {
    href: '/calculadoras/imc',
    icon: Scale,
    title: 'Calculadora de IMC',
    description: 'Descubra sua faixa de IMC de forma rápida e simples.',
    cta: 'Calcular IMC',
    preview: <SemicircleGauge fraction={0.55} size={128} strokeWidth={12} />,
  },
  {
    href: '/calculadoras/tdee',
    icon: Flame,
    title: 'Gasto energético diário',
    description: 'Descubra quantas calorias seu corpo utiliza diariamente.',
    cta: 'Calcular TDEE',
    preview: <MiniBarChart values={[6, 9, 5, 10, 7, 11, 8]} width={140} height={64} />,
  },
  {
    href: '/calculadoras/macros',
    icon: PieChart,
    title: 'Macronutrientes',
    description: 'Distribua proteínas, carboidratos e gorduras de acordo com seu objetivo.',
    cta: 'Calcular macros',
    preview: (
      <DonutChart
        segments={[
          { value: 30, color: '#554FE8' },
          { value: 50, color: '#8390F6' },
          { value: 20, color: '#E7BD5B' },
        ]}
        size={112}
        strokeWidth={16}
      />
    ),
  },
] as const

export function CalculatorsSection() {
  return (
    <section id="calculadoras" className="scroll-mt-28 bg-surface py-[72px] sm:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] leading-tight font-bold tracking-tight text-text-primary sm:text-[40px]">
            Tudo que você precisa para entender seus números
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {CALCULATORS.map(({ href, icon: Icon, title, description, cta, preview }) => (
            <div
              key={href}
              className="flex min-h-[360px] flex-col rounded-[32px] border border-border bg-surface-soft p-8 transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(65,75,135,0.13)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>

              <div aria-hidden="true" className="mt-6 flex flex-1 items-center justify-center">
                {preview}
              </div>

              <LinkButton href={href} variant="secondary" className="mt-6 h-12 w-full text-sm">
                {cta} <ChevronRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
              </LinkButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
