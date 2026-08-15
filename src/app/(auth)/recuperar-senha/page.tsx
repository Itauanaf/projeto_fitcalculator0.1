import type { Metadata } from 'next'
import { RequestPasswordResetForm } from '@/features/auth/request-password-reset-form'

export const metadata: Metadata = {
  title: 'Recuperar senha · FitCalculator',
  description: 'Redefina a senha da sua conta FitCalculator.',
}

export default function RequestPasswordResetPage() {
  return <RequestPasswordResetForm />
}
