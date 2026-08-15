import type { Metadata } from 'next'
import { SignUpForm } from '@/features/auth/sign-up-form'

export const metadata: Metadata = {
  title: 'Criar conta · FitCalculator',
  description: 'Crie sua conta de aluno ou personal trainer no FitCalculator.',
}

export default function SignUpPage() {
  return <SignUpForm />
}
