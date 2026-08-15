import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-foreground px-6 py-2.5',
        'text-sm font-medium text-background transition-opacity hover:opacity-90',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}
