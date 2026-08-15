import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'FitCalculator',
    template: '%s',
  },
  description:
    'Calcule IMC, TMB, TDEE, meta calórica e macronutrientes de forma simples, num só lugar.',
}

/**
 * The true root layout — shared by every route group ((public), (auth),
 * and eventually (student)/(trainer)), each of which brings its own
 * header/footer/sidebar chrome around its own `<main id="main-content">`.
 * Kept minimal on purpose so an auth or dashboard page never inherits
 * the marketing navbar by accident.
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-full focus-visible:bg-primary focus-visible:px-5 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:shadow-lg"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  )
}
