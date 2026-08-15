import { ArrowRight, Play } from 'lucide-react'
import { LinkButton } from '@/components/ui'
import { BenefitsBar } from './benefits-bar'
import { DumbbellDecoration, HeroBackdrop, ShakerDecoration } from './decorative-shapes'
import { FloatingBmiCard, FloatingMacrosCard, FloatingTdeeCard } from './floating-cards'
import { PhonePreview } from './phone-preview'

export function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden pt-20 pb-16 sm:pt-[110px]">
      <HeroBackdrop />
      <DumbbellDecoration className="animate-float absolute bottom-32 left-4 hidden xl:block" />
      <ShakerDecoration
        className="animate-float absolute bottom-32 right-4 hidden xl:block"
        style={{ animationDelay: '1.2s' }}
      />

      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center">
        <h1 className="animate-rise-in max-w-[950px] text-[38px] leading-[1.08] font-bold tracking-[-0.045em] text-text-primary sm:text-[64px] sm:leading-[1.03]">
          Calcule seu{' '}
          <span className="bg-gradient-to-r from-[#5147E8] via-[#6A64F4] to-[#4557DB] bg-clip-text text-transparent">
            IMC, TDEE
          </span>{' '}
          e{' '}
          <span className="bg-gradient-to-r from-[#5147E8] via-[#6A64F4] to-[#4557DB] bg-clip-text text-transparent">
            Macros
          </span>{' '}
          com clareza e rapidez
        </h1>

        <p
          className="animate-rise-in mt-5 max-w-[720px] text-[17px] leading-[1.55] text-text-secondary"
          style={{ animationDelay: '80ms' }}
        >
          Entenda suas necessidades calóricas, métricas corporais e macronutrientes diárias em uma
          única ferramenta moderna e completa.
        </p>

        <div
          className="animate-rise-in mt-7 flex flex-col gap-3.5 sm:flex-row"
          style={{ animationDelay: '140ms' }}
        >
          <LinkButton href="/calculadoras/imc" variant="primary">
            Começar agora <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
          </LinkButton>
          <LinkButton href="#como-funciona" variant="secondary">
            Ver como funciona <Play className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
          </LinkButton>
        </div>

        {/* Product showcase: phone + floating feature cards (desktop only). Decorative
            example output from the calculators — hidden from assistive tech so it doesn't
            read as real content or duplicate the CTAs above. */}
        <div
          aria-hidden="true"
          className="relative mt-16 hidden h-[620px] w-full max-w-[1100px] items-center justify-center lg:flex"
        >
          <FloatingBmiCard className="absolute top-6 left-0 xl:left-10" />
          <FloatingMacrosCard className="absolute top-6 right-0 xl:right-10" />
          <FloatingTdeeCard className="absolute bottom-6 left-0 xl:left-10" />
          <PhonePreview />
        </div>

        {/* Mobile/tablet: phone alone, plus two compact stat chips instead of the floating cards */}
        <div aria-hidden="true" className="mt-12 flex justify-center lg:hidden">
          <PhonePreview />
        </div>
        <div aria-hidden="true" className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3 lg:hidden">
          <div className="rounded-2xl border border-border bg-white/80 p-4 text-left shadow-[0_12px_30px_rgba(36,47,102,0.08)]">
            <span className="text-xs font-semibold text-text-secondary">IMC</span>
            <p className="text-2xl font-bold tracking-tight text-text-primary">23,4</p>
            <p className="text-xs font-medium text-success">Peso normal</p>
          </div>
          <div className="rounded-2xl border border-border bg-white/80 p-4 text-left shadow-[0_12px_30px_rgba(36,47,102,0.08)]">
            <span className="text-xs font-semibold text-text-secondary">TDEE</span>
            <p className="text-2xl font-bold tracking-tight text-text-primary">2.350 kcal</p>
            <p className="text-xs text-text-muted">Gasto diário</p>
          </div>
        </div>

        <div className="mt-16 w-full">
          <BenefitsBar />
        </div>
      </div>
    </section>
  )
}
