import { CupSoda, Dumbbell } from 'lucide-react'
import type { CSSProperties } from 'react'

interface DecorationProps {
  className?: string
  style?: CSSProperties
}

/**
 * Subtle organic shapes behind the hero content — a fallback for the
 * spec's "abstract mountains / soft waves", hand-drawn as two
 * low-opacity SVG silhouettes rather than photography or 3D assets.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 w-full text-indigo/[0.12]"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 160C240 90 420 200 660 140C900 80 1080 190 1440 110V220H0V160Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-full text-primary/[0.08]"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 120C320 190 500 60 780 120C1060 180 1200 70 1440 130V180H0V120Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

/** Decorative dumbbell — a nod to "fitness objects" without a photorealistic 3D render. */
export function DumbbellDecoration({ className, style }: DecorationProps) {
  return (
    <div aria-hidden className={className} style={style}>
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/25 to-violet/25 blur-2xl" />
        <Dumbbell
          className="h-20 w-20 -rotate-[18deg] text-primary/60 sm:h-28 sm:w-28"
          strokeWidth={1.5}
        />
      </div>
    </div>
  )
}

/** Decorative shaker/bottle, same treatment as the dumbbell. */
export function ShakerDecoration({ className, style }: DecorationProps) {
  return (
    <div aria-hidden className={className} style={style}>
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-blue-soft/25 to-primary/25 blur-2xl" />
        <CupSoda
          className="h-20 w-20 rotate-[12deg] text-blue-soft/60 sm:h-28 sm:w-28"
          strokeWidth={1.5}
        />
      </div>
    </div>
  )
}
