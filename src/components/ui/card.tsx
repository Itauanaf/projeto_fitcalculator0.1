import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-border bg-surface p-6 shadow-[0_18px_45px_rgba(36,47,102,0.08)] sm:p-8',
        className
      )}
      {...props}
    />
  )
}

/** Result panels get a soft tinted background instead of the plain white card. */
export function ResultCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-border bg-gradient-to-br from-[#F7F8FF] to-[#EEF1FF] p-6',
        'shadow-[0_18px_45px_rgba(36,47,102,0.08)] sm:p-8',
        className
      )}
      {...props}
    />
  )
}
