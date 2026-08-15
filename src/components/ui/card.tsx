import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 sm:p-8',
        className
      )}
      {...props}
    />
  )
}
