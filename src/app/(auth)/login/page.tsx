import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/login-form'

export const metadata: Metadata = {
  title: 'Entrar · FitCalculator',
  description: 'Acesse sua conta FitCalculator.',
}

export default function LoginPage() {
  return <LoginForm />
}
