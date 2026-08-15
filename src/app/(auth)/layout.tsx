import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LogoMark } from '@/components/brand'

/**
 * Minimal, centered chrome for login/signup/password-recovery — no
 * marketing navbar (nothing to navigate to mid-flow) and no footer.
 */
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="hero-gradient flex flex-1 flex-col items-center justify-center px-6 py-16 outline-none"
    >
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para o início
      </Link>
      <Link href="/" className="mb-8 flex items-center gap-2">
        <LogoMark className="h-8 w-8 text-primary" />
        <span className="text-[22px] font-bold tracking-tight text-text-primary">
          FitCalculator
        </span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </main>
  )
}
