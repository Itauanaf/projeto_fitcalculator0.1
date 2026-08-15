import Link from 'next/link'

const NAV_LINKS = [
  { href: '/calculadoras/imc', label: 'IMC' },
  { href: '/calculadoras/tdee', label: 'TDEE' },
  { href: '/calculadoras/macros', label: 'Macros' },
] as const

export function SiteHeader() {
  return (
    <header className="border-b border-foreground/10">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          FitCalculator
        </Link>
        <nav className="flex gap-5 text-sm font-medium text-foreground/70">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
