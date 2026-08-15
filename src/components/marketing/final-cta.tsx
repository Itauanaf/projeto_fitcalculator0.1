import { ArrowRight } from 'lucide-react'
import { LinkButton } from '@/components/ui'

export function FinalCta() {
  return (
    <section className="bg-surface px-6 py-[72px] sm:py-[110px]">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[40px] bg-gradient-to-br from-[#4B46E5] to-[#7389FF] px-8 py-16 text-center sm:px-16">
        <h2 className="mx-auto max-w-xl text-[32px] leading-tight font-bold tracking-tight text-white sm:text-[40px]">
          Entenda melhor seus números. Comece agora.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-white/80">
          Crie sua conta gratuita e calcule seu IMC, TDEE e macros em poucos minutos.
        </p>
        <LinkButton href="/cadastro" variant="light" className="mt-8">
          Criar conta grátis <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
        </LinkButton>
      </div>
    </section>
  )
}
