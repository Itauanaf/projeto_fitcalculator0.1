import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { cn } from '@/lib/cn'

interface TextareaFieldProps {
  label: string
  rows?: number
  error?: FieldError
  registration: UseFormRegisterReturn
}

/** The `TextField`/`NumberField` counterpart for longer free text (e.g. a trainer's bio). */
export function TextareaField({ label, rows = 4, error, registration }: TextareaFieldProps) {
  const errorId = error ? `${registration.name}-error` : undefined

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-text-secondary">{label}</span>
      <textarea
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          'resize-none rounded-[14px] border bg-surface-soft px-4 py-3 text-[15px] text-text-primary outline-none',
          'transition-all duration-150 placeholder:text-text-muted',
          'focus:border-[#625CF3] focus:shadow-[0_0_0_4px_rgba(98,92,243,0.10)]',
          error ? 'border-rose-400' : 'border-border'
        )}
        {...registration}
      />
      {error && (
        <span id={errorId} role="alert" className="text-xs text-rose-500">
          {error.message}
        </span>
      )}
    </label>
  )
}
