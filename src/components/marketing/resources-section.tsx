import { History, Lock, Share2, Target, TrendingUp, UserCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const RESOURCES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: UserCircle,
    title: 'Perfil corporal',
    description: 'Cadastre uma vez e reaproveite em todas as calculadoras.',
  },
  {
    icon: History,
    title: 'Histórico',
    description: 'Acompanhe seus cálculos anteriores ao longo do tempo.',
  },
  {
    icon: Target,
    title: 'Metas',
    description: 'Defina objetivos de peso e acompanhe seu progresso.',
  },
  {
    icon: TrendingUp,
    title: 'Cálculos integrados',
    description: 'IMC, TMB, TDEE e macros conectados entre si.',
  },
  {
    icon: Share2,
    title: 'Compartilhamento',
    description: 'Envie seus resultados para quem você quiser.',
  },
  {
    icon: Lock,
    title: 'Privacidade',
    description: 'Um personal só vê os dados de alunos vinculados — nunca de outra pessoa.',
  },
]

export function ResourcesSection() {
  return (
    <section id="recursos" className="scroll-mt-28 bg-surface py-[72px] sm:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] leading-tight font-bold tracking-tight text-text-primary sm:text-[40px]">
            Feito para acompanhar sua evolução
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-[24px] border border-border bg-surface-soft p-[26px]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-text-primary">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
