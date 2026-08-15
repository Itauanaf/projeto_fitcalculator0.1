import Link from 'next/link'
import { LogoMark } from '@/components/brand'

const FOOTER_LINKS = [
  { href: '/calculadoras/imc', label: 'IMC' },
  { href: '/calculadoras/tdee', label: 'TDEE' },
  { href: '/calculadoras/macros', label: 'Macros' },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold tracking-tight text-text-primary">FitCalculator</span>
        </Link>

        <nav
          aria-label="Rodapé"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-text-secondary"
        >
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
          <span className="cursor-default text-text-muted">Privacidade</span>
          <span className="cursor-default text-text-muted">Termos</span>
        </nav>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} FitCalculator
      </div>
    </footer>
  )
}
