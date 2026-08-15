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
  const errorId = error ? `${registration.name}-error` : undefined

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-text-secondary">{label}</span>
      <select
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          'h-[52px] rounded-[14px] border bg-surface-soft px-4 text-[15px] text-text-primary outline-none',
          'transition-all duration-150',
          'focus:border-[#625CF3] focus:shadow-[0_0_0_4px_rgba(98,92,243,0.10)]',
          error ? 'border-rose-400' : 'border-border'
        )}
        {...registration}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} role="alert" className="text-xs text-rose-500">
          {error.message}
        </span>
      )}
    </label>
  )
}
