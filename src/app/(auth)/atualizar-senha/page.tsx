import type { Metadata } from 'next'
import { UpdatePasswordForm } from '@/features/auth/update-password-form'

export const metadata: Metadata = {
  title: 'Nova senha · FitCalculator',
  description: 'Defina uma nova senha para sua conta FitCalculator.',
}

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />
}
