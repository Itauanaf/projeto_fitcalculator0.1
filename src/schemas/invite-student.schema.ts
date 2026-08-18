import { z } from 'zod'

/** Validates the trainer dashboard's "invite a student" form. */
export const inviteStudentSchema = z.object({
  email: z.email('Informe um e-mail válido'),
})

export type InviteStudentFormInput = z.infer<typeof inviteStudentSchema>
