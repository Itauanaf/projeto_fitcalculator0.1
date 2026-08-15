import { z } from 'zod'

/** Roles a person can self-select at signup. `admin` is granted manually, never chosen here. */
export const SIGNUP_ROLE_VALUES = ['student', 'trainer'] as const

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Informe seu nome completo'),
    email: z.email('Informe um e-mail válido'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
    role: z.enum(SIGNUP_ROLE_VALUES, { message: 'Selecione se você é aluno ou personal trainer' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

export const requestPasswordResetSchema = z.object({
  email: z.email('Informe um e-mail válido'),
})

export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
