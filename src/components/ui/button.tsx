import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'light'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#5F55F4] to-[#493FE0] text-white shadow-[0_12px_28px_rgba(81,71,232,0.25)] hover:shadow-[0_16px_32px_rgba(81,71,232,0.32)]',
  secondary: 'border border-[rgba(74,86,150,0.15)] bg-white/40 text-text-primary backdrop-blur-md',
  dark: 'bg-[#10142e] text-white',
  // For a CTA sitting on a colored/dark background (e.g. the final CTA panel).
  light:
    'bg-white text-[#3F3AD6] shadow-[0_12px_28px_rgba(16,20,60,0.25)] hover:shadow-[0_16px_34px_rgba(16,20,60,0.32)]',
}

const BASE_CLASSES =
  'inline-flex h-[50px] items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold ' +
  'transition-all duration-200 ease-out hover:-translate-y-0.5 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

/** Shared by `Button` and `LinkButton` so a link that looks like a button and a real `<button>` never drift apart. */
export function buttonClassName(variant: ButtonVariant = 'primary', className?: string) {
  return cn(BASE_CLASSES, VARIANT_CLASSES[variant], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={buttonClassName(variant, className)} {...props} />
}
