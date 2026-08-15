type ClassValue = string | number | null | boolean | undefined

/**
 * Joins class names conditionally, filtering out falsy values.
 * Small local helper so components don't need an external dependency
 * for something this simple.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
