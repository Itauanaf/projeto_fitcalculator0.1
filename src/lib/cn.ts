import { twMerge } from 'tailwind-merge'

type ClassValue = string | number | null | boolean | undefined

/**
 * Joins class names conditionally (filtering out falsy values) and
 * resolves conflicting Tailwind utilities so the last one wins — e.g.
 * `cn('h-[50px]', 'h-10')` returns `'h-10'` instead of leaving both
 * classes in the string, where the winner would depend on Tailwind's
 * generated CSS order rather than intent.
 */
export function cn(...values: ClassValue[]): string {
  return twMerge(values.filter(Boolean).join(' '))
}
