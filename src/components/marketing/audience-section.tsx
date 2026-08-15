import { ArrowRight, Dumbbell, User } from 'lucide-react'
import { LinkButton } from '@/components/ui'

const AUDIENCES = [
  {
    icon: User,
    label: 'Aluno',
    title: 'Acompanhe seu próprio progresso',
    description:
      'Crie sua conta, calcule seus números e comece a registrar sua evolução ao longo do tempo.',
  },
  {
    icon: Dumbbell,
    label: 'Personal Trainer',
    title: 'Acompanhe seus alunos',
    description:
      'Crie sua conta de personal trainer e comece a estruturar o acompanhamento dos seus alunos.',
  },
] as const

export function AudienceSection() {
  return (
    <section className="bg-surface-soft py-[72px] sm:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] leading-tight font-bold tracking-tight text-text-primary sm:text-[40px]">
            Feito para quem treina e para quem acompanha
          </h2>
          <p className="mt-3 text-[17px] text-text-secondary">
            Uma conta, dois jeitos de usar — escolha o seu perfil ao se cadastrar.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {AUDIENCES.map(({ icon: Icon, label, title, description }) => (
            <div
              key={label}
              className="flex flex-col rounded-[32px] border border-border bg-surface p-8"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="mt-5 text-xs font-semibold tracking-wide text-primary uppercase">
                {label}
              </span>
              <h3 className="mt-1 text-xl font-semibold text-text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>

              <LinkButton href="/cadastro" variant="secondary" className="mt-6 h-12 w-full text-sm">
                Criar conta de {label.toLowerCase()}{' '}
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
              </LinkButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
