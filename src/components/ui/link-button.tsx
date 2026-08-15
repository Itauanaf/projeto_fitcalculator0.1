import Link, { type LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { buttonClassName, type ButtonVariant } from './button'

interface LinkButtonProps extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  variant?: ButtonVariant
  children?: ReactNode
}

/** Same look as `Button`, but a real `<a>` (via `next/link`) — never nest this inside a `<button>`. */
export function LinkButton({
  variant = 'primary',
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={buttonClassName(variant, className)} {...props}>
      {children}
    </Link>
  )
}
