'use client'

import { Star } from 'lucide-react'
import {
  Controller,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { cn } from '@/lib/cn'

interface StarRatingFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  error?: FieldError
  max?: number
}

/** A 1-5 star picker wired to react-hook-form via `Controller` — used for the check-in's energy/hunger/sleep ratings. */
export function StarRatingField<T extends FieldValues>({
  name,
  control,
  label,
  error,
  max = 5,
}: StarRatingFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-secondary">{label}</span>
          <div role="radiogroup" aria-label={label} className="flex gap-1">
            {Array.from({ length: max }, (_, index) => index + 1).map((value) => {
              const filled = typeof field.value === 'number' && value <= field.value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={field.value === value}
                  aria-label={`${value} de ${max}`}
                  onClick={() => field.onChange(value)}
                  className="rounded p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Star
                    className={cn('h-6 w-6', filled ? 'fill-primary text-primary' : 'text-border')}
                    strokeWidth={1.5}
                  />
                </button>
              )
            })}
          </div>
          {error && (
            <span role="alert" className="text-xs text-rose-500">
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  )
}
