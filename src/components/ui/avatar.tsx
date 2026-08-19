import { cn } from '@/lib/cn'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-14 w-14 text-lg',
} as const

/** A circular initial — no photo upload exists, so this is every account's only avatar. */
export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#625CF3] to-primary-hover font-bold text-white',
        SIZE_CLASSES[size],
        className
      )}
    >
      {initial}
    </span>
  )
}
