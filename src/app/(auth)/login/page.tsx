import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/features/auth/login-form'

export const metadata: Metadata = {
  title: 'Entrar · FitCalculator',
  description: 'Acesse sua conta FitCalculator.',
}

export default function LoginPage() {
  return (
    // useSearchParams() (reading ?next=) requires a Suspense boundary
    // for this page to still prerender statically.
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
