import type { SVGProps } from 'react'

/**
 * FitCalculator's brand mark: an apple silhouette with a heartbeat
 * line running through it. Adapted from the original logo
 * (`legacy/assets/fit02.png`, the green apple + EKG line that used
 * to replace the "o" in "Calculator") into a single-color line icon
 * so it can sit inside the gradient badge like any other icon here,
 * instead of shipping the old raster PNG as-is.
 *
 * `aria-hidden` by default — every usage sits right next to the
 * "FitCalculator" text, so the mark itself has nothing to announce.
 */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Leaf */}
      <path
        d="M16.2 6.4C15.3 3.6 13.2 2.3 11.6 1.4C11.4 4.2 13 6 15.6 7.2"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Apple silhouette */}
      <path
        d="M16 27.2C8.4 20.7 3.2 16 3.2 11c0-4 3.2-6.8 6.8-6.8 2.6 0 4.8 1.5 6 3.8 1.2-2.3 3.4-3.8 6-3.8 3.6 0 6.8 2.8 6.8 6.8 0 5-5.2 9.7-12.8 16.2Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heartbeat line, cutting through and past the silhouette */}
      <path
        d="M1 17h8l2.4 5.5L15.5 9l2.6 8H31"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
