import type { Metadata } from 'next'
import {
  CalculatorsSection,
  FinalCta,
  Hero,
  HowItWorksSection,
  ResourcesSection,
} from '@/components/marketing'

export const metadata: Metadata = {
  title: 'FitCalculator',
  description:
    'Calcule seu IMC, TDEE e macros com clareza e rapidez. Entenda suas necessidades calóricas, métricas corporais e macronutrientes diárias numa única ferramenta moderna e completa.',
}

export default function Home() {
  return (
    <>
      <Hero />
      <CalculatorsSection />
      <HowItWorksSection />
      <ResourcesSection />
      <FinalCta />
    </>
  )
}
