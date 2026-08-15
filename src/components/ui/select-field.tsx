import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { cn } from '@/lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  options: readonly SelectOption[]
  error?: FieldError
  registration: UseFormRegisterReturn
}

export function SelectField({ label, options, error, registration }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <select
        aria-invalid={error ? true : undefined}
        className={cn(
          'rounded-lg border bg-transparent px-3 py-2 text-base outline-none transition-colors',
          'focus:border-foreground/40',
          error ? 'border-red-500' : 'border-foreground/15'
        )}
        {...registration}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </label>
  )
}
