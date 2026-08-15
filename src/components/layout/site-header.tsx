'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LogoMark } from '@/components/brand'
import { LinkButton } from '@/components/ui'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/#calculadoras', label: 'Calculadoras' },
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/#recursos', label: 'Recursos' },
] as const

type NavHref = (typeof NAV_LINKS)[number]['href']

/**
 * Which link a URL corresponds to. Only `/` and `/#calculadoras` map to a
 * distinct route (`/` and `/calculadoras/*`) — "Como funciona" and
 * "Recursos" are same-page anchors with no route of their own, so they
 * can only become active by being clicked (below), not by URL.
 */
function activeHrefForPathname(pathname: string): NavHref {
  if (pathname.startsWith('/calculadoras')) return '/#calculadoras'
  return '/'
}

export function SiteHeader() {
  const pathname = usePathname()
  const [activeHref, setActiveHref] = useState<NavHref>(() => activeHrefForPathname(pathname))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null)

  // A route actually changing means real navigation happened (as opposed to
  // clicking a same-page anchor) — recompute which link that corresponds to
  // and close the mobile menu. Adjusted during render (React's recommended
  // pattern for resetting state on a prop change) rather than in an effect,
  // which would cause an extra, avoidable render pass.
  const [syncedPathname, setSyncedPathname] = useState(pathname)
  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname)
    setActiveHref(activeHrefForPathname(pathname))
    setIsMenuOpen(false)
  }

  // Escape closes the menu and returns focus to the button that opened it.
  useEffect(() => {
    if (!isMenuOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    firstMenuLinkRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  function handleNavClick(href: NavHref) {
    setActiveHref(href)
    setIsMenuOpen(false)
  }

  return (
    <div className="sticky top-4 z-50 px-4">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col">
        <header
          className={cn(
            'flex h-[64px] w-full items-center justify-between gap-4 rounded-full px-4 sm:h-[74px] sm:gap-6 sm:px-6',
            'border border-white/75 bg-white/91 shadow-[0_18px_45px_rgba(53,67,140,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]',
            'backdrop-blur-xl'
          )}
        >
          <Link href="/" className="flex items-center gap-2" onClick={() => handleNavClick('/')}>
            <LogoMark className="h-8 w-8 text-primary" />
            <span className="text-[22px] font-bold tracking-tight text-text-primary">
              FitCalculator
            </span>
          </Link>

          <nav
            aria-label="Principal"
            className="hidden items-center gap-6 text-[15px] font-medium text-[#343B59] md:flex"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeHref === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    'py-1 transition-colors hover:text-primary',
                    isActive && 'text-primary'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-[15px] font-medium text-[#343B59] transition-colors hover:text-primary md:block"
            >
              Entrar
            </Link>
            <LinkButton
              href="/cadastro"
              variant="dark"
              className="hidden h-12 px-6 text-sm md:flex"
            >
              Criar conta <span aria-hidden="true">→</span>
            </LinkButton>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              className={cn(
                'grid h-11 w-11 shrink-0 place-items-center rounded-full text-text-primary',
                'transition-colors hover:bg-primary-soft hover:text-primary',
                'focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'md:hidden'
              )}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        <nav
          id="mobile-nav-menu"
          aria-label="Menu mobile"
          hidden={!isMenuOpen}
          className="mt-2 flex flex-col gap-1 rounded-[24px] border border-white/75 bg-white/95 p-3 shadow-[0_18px_45px_rgba(53,67,140,0.10)] backdrop-blur-xl md:hidden"
        >
          {NAV_LINKS.map((link, index) => {
            const isActive = activeHref === link.href
            return (
              <Link
                key={link.href}
                ref={index === 0 ? firstMenuLinkRef : undefined}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  'rounded-2xl px-4 py-3 text-[15px] font-medium text-[#343B59] transition-colors',
                  isActive
                    ? 'bg-primary-soft text-primary'
                    : 'hover:bg-primary-soft hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-2xl px-4 py-3 text-[15px] font-medium text-[#343B59] transition-colors hover:bg-primary-soft hover:text-primary"
          >
            Entrar
          </Link>
          <LinkButton
            href="/cadastro"
            variant="primary"
            className="mt-1 h-12 w-full text-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            Criar conta <span aria-hidden="true">→</span>
          </LinkButton>
        </nav>
      </div>
    </div>
  )
}
