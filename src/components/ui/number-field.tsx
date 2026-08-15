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
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">
        {label}
        {unit ? ` (${unit})` : ''}
      </span>
      <input
        type="number"
        step="any"
        inputMode="decimal"
        aria-invalid={error ? true : undefined}
        className={cn(
          'rounded-lg border bg-transparent px-3 py-2 text-base outline-none transition-colors',
          'focus:border-foreground/40',
          error ? 'border-red-500' : 'border-foreground/15'
        )}
        {...registration}
      />
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </label>
  )
}
