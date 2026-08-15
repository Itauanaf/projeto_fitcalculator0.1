const STEPS = [
  {
    number: '01',
    title: 'Informe seus dados',
    description: 'Peso, altura, idade e nível de atividade — leva menos de um minuto.',
  },
  {
    number: '02',
    title: 'Escolha seu objetivo',
    description: 'Perder peso, manter ou ganhar massa, com a estratégia de macros que preferir.',
  },
  {
    number: '03',
    title: 'Veja seus resultados',
    description: 'IMC, TMB, TDEE, meta calórica e macros calculados na hora, sem enrolação.',
  },
] as const

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="scroll-mt-28 bg-surface-soft py-[72px] sm:py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] leading-tight font-bold tracking-tight text-text-primary sm:text-[40px]">
            Como funciona
          </h2>
        </div>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              {index < STEPS.length - 1 && (
                <span className="absolute top-7 left-[calc(50%+56px)] hidden h-px w-[calc(100%-112px)] bg-border sm:block" />
              )}
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-violet text-lg font-bold text-white">
                {step.number}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
