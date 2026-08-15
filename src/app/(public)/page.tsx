import type { Metadata } from 'next'
import {
  AudienceSection,
  CalculatorsSection,
  FinalCta,
  Hero,
  HowItWorksSection,
  ResourcesSection,
} from '@/components/marketing'

export const metadata: Metadata = {
  title: 'FitCalculator',
  description:
    'Crie uma conta gratuita e calcule seu IMC, TDEE e macros com clareza e rapidez. Acompanhe sua evolução como aluno, ou a de seus alunos como personal trainer.',
}

export default function Home() {
  return (
    <>
      <Hero />
      <CalculatorsSection />
      <AudienceSection />
      <HowItWorksSection />
      <ResourcesSection />
      <FinalCta />
    </>
  )
}
