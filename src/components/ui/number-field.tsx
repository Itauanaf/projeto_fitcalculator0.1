import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { cn } from '@/lib/cn'

interface NumberFieldProps {
  label: string
  unit?: string
  error?: FieldError
  registration: UseFormRegisterReturn
}

/**
 * A labeled numeric input wired to a React Hook Form registration.
 * Shared by every calculator form so weight/height/age fields look
 * and behave the same everywhere.
 */
export function NumberField({ label, unit, error, registration }: NumberFieldProps) {
  const errorId = error ? `${registration.name}-error` : undefined

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-text-secondary">
        {label}
        {unit ? ` (${unit})` : ''}
      </span>
      <input
        type="number"
        step="any"
        inputMode="decimal"
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          'h-[52px] rounded-[14px] border bg-surface-soft px-4 text-[15px] text-text-primary outline-none',
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
